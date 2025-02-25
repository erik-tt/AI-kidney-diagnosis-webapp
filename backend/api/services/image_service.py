import os
from django.conf import settings
import numpy as np
import nibabel as nib
import pydicom
import io
from PIL import Image


def save_and_get_images(dicom_file, report_id, patient) :
    dicom_data = pydicom.dcmread(io.BytesIO(dicom_file.read()))
    pixel_array = dicom_data.pixel_array.astype(np.float32)
    avg_array = np.mean(pixel_array[6:18], axis=0)

    #Nifti image for model input
    output_path = os.path.join(settings.MEDIA_ROOT, f"data/patient_{patient}/")
    os.makedirs(output_path, exist_ok=True)
    image_nii = nib.Nifti1Image(avg_array, affine=np.eye(4))
    image_nii_path = os.path.join(output_path, f"{report_id}_image.nii.gz")
    nib.save(image_nii, image_nii_path)

    #PNG for showing mask overlay
    #PNG need normalization
    normalized_array = ((avg_array - avg_array.min()) / (avg_array.max() - avg_array.min()) * 255).astype(np.uint8)
    image_png_path = os.path.join(output_path, f"{report_id}_image.png")
    image_png = Image.fromarray(normalized_array, mode="L")
    image_png.save(image_png_path)

    #return the relative paths
    image_nii_rel_path = f"data/patient_{patient}/{report_id}_image.nii.gz"
    image_png_rel_path = f"data/patient_{patient}/{report_id}_image.png"

    return image_nii_rel_path, image_png_rel_path




    
    
