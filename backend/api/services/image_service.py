import io
import os
import shutil
from django.conf import settings
import numpy as np
import nibabel as nib
from PIL import Image
import PIL.ImageOps
from django.core.files.base import ContentFile

tmp_path = os.path.join(settings.BASE_DIR, f"tmp/")
os.makedirs(tmp_path, exist_ok=True)

def get_nifti_img_path(avg_pixel_array) :
    #Nifti image for model input
    image_nii = nib.Nifti1Image(avg_pixel_array, affine=np.eye(4))
    image_nii_path = os.path.join(tmp_path, f"image.nii.gz")
    nib.save(image_nii, image_nii_path)

    return image_nii_path

def get_avg_png_1_3(avg_pixel_array) :
    #PNG for showing mask overlay
    #PNG need normalization
    normalized_array = ((avg_pixel_array - avg_pixel_array.min()) / (avg_pixel_array.max() - avg_pixel_array.min()) * 255).astype(np.uint8)
    image_png = PIL.ImageOps.invert(Image.fromarray(normalized_array, mode="L"))
    image_png_path = os.path.join(tmp_path, f"image.png")
    image_png.save(image_png_path)

    return image_png_path

#Returns 4 average images
def get_4_avg_pngs(dicom):
    step = int(len(dicom) / 4)

    files = []

    buffer = io.BytesIO()
    for i in range (0, 180, step):
        mean_arr =  1 - np.mean(dicom[i:i+step], axis=0)
        normalized_array = ((mean_arr - mean_arr.min()) / (mean_arr.max() - mean_arr.min()) * 255).astype(np.uint8)
        mean_img = Image.fromarray(normalized_array)
        buffer.seek(0)
        mean_img.save(buffer, format='PNG')
        buffer.truncate() 
        img_file = ContentFile(buffer.getvalue(), name=f'image_{i}_{i+step}.png')
        files.append(img_file)
        buffer.flush()
        i += step

    buffer.close()

    return files
    
    

def cleanup_tmp():
    for filename in os.listdir(tmp_path):
        file_path = os.path.join(tmp_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))






    
    
