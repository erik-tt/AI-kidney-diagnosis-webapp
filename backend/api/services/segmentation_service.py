import os
import io
from monai.networks.nets import SwinUNETR
from monai.transforms import (
    Compose,
    EnsureType,
    LoadImage,
    ToTensor,
    NormalizeIntensity
)
import numpy as np
import torch
import nibabel as nib
from django.conf import settings
import cv2
from PIL import Image


def transform_image(image_path):
    transforms = Compose([
            LoadImage(image_only=True),
            EnsureType(),
            NormalizeIntensity(nonzero=True, channel_wise=True),
            ToTensor()
        ])
    
    image = transforms(image_path).unsqueeze(0)
    return image.unsqueeze(0)


def get_segmentation_prediction(image_path):
    model =  SwinUNETR(
            img_size=[128, 128],
            spatial_dims=2,
            in_channels=1,
            out_channels=2,
            use_v2 = True
        )

    #change it to be torch script
    model.load_state_dict(torch.load(os.path.join(settings.BASE_DIR ,'api/services/models/segmentation/checkpoint_swinunetrv2.pth'), weights_only=False, map_location=torch.device('cpu'))["model_state_dict"]) # This line uses .load() to read a .pth file and load the network weights on to the architecture.
    model.eval()

    tensor = transform_image(image_path)
    output = model(tensor)
    output = torch.argmax(output, dim=1).squeeze(0)
    output_remove_one_hot = output.cpu().numpy()
    #Set the right side to be 2
    output_remove_one_hot[:, output_remove_one_hot.shape[0]//2:] = np.where(output_remove_one_hot[:, output_remove_one_hot.shape[0]//2:] == 1, 2, output_remove_one_hot[:, output_remove_one_hot.shape[0]//2:])

    return output_remove_one_hot


#Draws the contours and filter out any extra clusters of predicted kidneys
def process_prediction(model_output, image):
    overlay_img = cv2.imread(image)
    output =np.array(model_output, dtype=np.uint8)

    contours, hierarchy = cv2.findContours(output, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    print("Number of Contours found = " + str(len(contours)))

    sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True) 
    number_of_kidneys = 0

    kidney_contours = []

    #get the two largest contours
    for contour in sorted_contours:
        if number_of_kidneys != 2:
            M = cv2.moments(contour)
            if M['m00'] != 0:
                cx = int(M['m10']/M['m00'])
                #Append the contour and the center point to the list
                kidney_contours.append({
                    "center_point_x" : cx,
                    "contour": contour
                    })
            number_of_kidneys += 1

    mask = np.zeros((128,128),  dtype=np.uint8)

    if len(kidney_contours) == 2:
        if kidney_contours[1]["center_point_x"] > kidney_contours[0]["center_point_x"]:
             #Draw the lines
             cv2.drawContours(overlay_img, kidney_contours[0]["contour"], -1, (255, 0, 0), 1)
             cv2.drawContours(overlay_img, kidney_contours[1]["contour"], -1, (0, 0, 255), 1)
             
             #Fill in the masks
             #cv2.fillPoly(mask)
             cv2.drawContours(mask, [kidney_contours[0]["contour"]], -1, color=1, thickness=cv2.FILLED)
             cv2.drawContours(mask, [kidney_contours[1]["contour"]], -1, color=2, thickness=cv2.FILLED)
        else:
            cv2.drawContours(overlay_img, [kidney_contours[0]["contour"]], -1, (0, 0, 255), 1)
            cv2.drawContours(overlay_img, [kidney_contours[1]["contour"]], -1, (255, 0, 0), 1)
            #Fill in the mask
            cv2.drawContours(mask, [kidney_contours[0]["contour"]], -1, color=2, thickness=cv2.FILLED)
            cv2.drawContours(mask, [kidney_contours[1]["contour"]], -1, color=1, thickness=cv2.FILLED)
    
    if len(kidney_contours) == 1:
        if kidney_contours[0]["center_point_x"] < 64:
            cv2.drawContours(overlay_img, kidney_contours[0]["contour"], -1, (255, 0, 0), 1)
            cv2.drawContours(mask, kidney_contours[0]["contour"], -1, color=1,  thickness=cv2.FILLED)
        else:
            cv2.drawContours(overlay_img, kidney_contours[0]["contour"], -1, (0, 0, 255), 1)
            cv2.drawContours(mask, kidney_contours[0]["contour"], -1, color=2,  thickness=cv2.FILLED)

    nifti_mask = nib.Nifti1Image(mask, affine=np.eye(4))

    overlay_img = Image.fromarray(overlay_img)
    overlay_buffer = io.BytesIO()
    overlay_img.save(overlay_buffer, format="PNG")
    overlay_buffer.seek(0)

    return overlay_buffer, nifti_mask
    

    
  