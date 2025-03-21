import io
import os
from django.conf import settings
from monai.networks.nets import TorchVisionFCModel
import numpy as np
from monai.transforms import (
    Compose,
    LoadImage,
    EnsureType,
    NormalizeIntensity,
    ToTensor,
    RepeatChannel,
    Resize,
)
import torch
from monai.visualize import GradCAMpp
import nibabel as nib
import cv2
from PIL import Image

#Load a trained model and set it to inference mode
#Change model to match the model path
model = TorchVisionFCModel(
        model_name='resnet18',
        num_classes=5,
        pretrained=True
)

#change it to be torch script
model.load_state_dict(torch.load(os.path.join(settings.BASE_DIR ,'api/services/models/classification/checkpoint_resnet18.pth'), weights_only=False, map_location=torch.device('cpu'))["model_state_dict"]) # This line uses .load() to read a .pth file and load the network weights on to the architecture.
model.eval()

#TODO create a better structure for transformations
def transform_image(image_path):
    transform_load = Compose([
            LoadImage(),
            EnsureType(),
        ])
    image = transform_load(image_path)
    
    transforms = Compose([
        RepeatChannel(repeats=3),
        Resize(spatial_size=(224, 224)),
        NormalizeIntensity(nonzero=True, channel_wise=True),
        ToTensor()
    ])
    
    image = transforms(image.unsqueeze(0))
    print(image.shape)
    return image.unsqueeze(0)


#TODO send in the dicom file and process it to handle a more advanced classification algo
def get_ckd_prediction(niftii_path, explanation = True):
    
    tensor = transform_image(niftii_path)
    output = model(tensor)

    output = torch.argmax(output, dim=1).item()

    buffer = None

    #grad cam
    if explanation:

        #Used for transforming the image back to its original size
        post_transforms = Compose([
            Resize(spatial_size=(128, 128)),
        ])

        grad_cam = GradCAMpp(nn_module=model, target_layers="features.7.1.conv2")
        result = grad_cam(x=tensor)
        grad_cam_im = np.array(post_transforms(result[0][0].unsqueeze(0)))
        img = nib.load(niftii_path)
        img_pixel_array = np.array(img.dataobj)
        
        #Inverts it as it looks like grad cam++ from monai have high values for low priorities. Look into this and remove this if necessary.
        grad_cam_im = 1- grad_cam_im

        # Normalize Grad-CAM and image to range [0, 255]
        heatmap = cv2.normalize(grad_cam_im.squeeze(), None, 0, 255, cv2.NORM_MINMAX)
        print(heatmap.shape)
        img_pixel_array = cv2.normalize(img_pixel_array, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        img_pixel_array = cv2.cvtColor(img_pixel_array, cv2.COLOR_GRAY2BGR)
        heatmap = np.uint8(heatmap)  # Convert to uint8

        # Apply the color map to create a heatmap image
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        
        # Blend heatmap with the original image
        overlay = cv2.addWeighted(img_pixel_array, 0.7, heatmap, 0.3, 0)
        grad_cam_im = Image.fromarray(overlay)
        buffer = io.BytesIO()
        grad_cam_im.save(buffer, format="PNG")
        buffer.seek(0)

        # Save the final image

    return output, buffer
