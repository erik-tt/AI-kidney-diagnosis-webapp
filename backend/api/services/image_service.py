import os
from django.conf import settings
import numpy as np
import nibabel as nib
from PIL import Image


def save_and_get_png_nifti_images(dicom_image, patient) :
    avg_array = np.mean(dicom_image[6:18], axis=0)

    #Nifti image for model input
    output_path = os.path.join(settings.MEDIA_ROOT, f"data/patient_{patient}/")
    os.makedirs(output_path, exist_ok=True)
    image_nii = nib.Nifti1Image(avg_array, affine=np.eye(4))
    image_nii_path = os.path.join(output_path, f"image.nii.gz")
    nib.save(image_nii, image_nii_path)
    
    #PNG for showing mask overlay
    #PNG need normalization
    normalized_array = ((avg_array - avg_array.min()) / (avg_array.max() - avg_array.min()) * 255).astype(np.uint8)
    image_png_path = os.path.join(output_path, f"image.png")
    image_png = Image.fromarray(normalized_array, mode="L")
    image_png.save(image_png_path)

    #return the relative paths
    image_nii_rel_path = f"data/patient_{patient}/image.nii.gz"
    image_png_rel_path = f"data/patient_{patient}/image.png"

    return image_nii_rel_path, image_nii_path, image_png_rel_path, image_png_path

def save_and_get_nifti_mask(pixel_array, patient) :
    #Nifti image for model input
    output_path = os.path.join(settings.MEDIA_ROOT, f"data/patient_{patient}/")
    os.makedirs(output_path, exist_ok=True)
    mask_nii = nib.Nifti1Image(pixel_array.astype(np.float32), affine=np.eye(4))
    mask_nii_path = os.path.join(output_path, "mask.nii.gz")
    nib.save(mask_nii, mask_nii_path)
    #return the relative paths
    mask_nii_rel_path = f"data/patient_{patient}/mask.nii.gz"

    return mask_nii_rel_path, mask_nii_path





    
    
