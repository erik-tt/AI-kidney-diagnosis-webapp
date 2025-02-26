import os
from monai.networks.nets import SwinUNETR
from monai.transforms import (
    Compose,
    EnsureType,
    LoadImage,
    ToTensor,
    NormalizeIntensity
)
import torch

from django.conf import settings

model =  SwinUNETR(
            img_size=[128, 128],
            spatial_dims=2,
            in_channels=1,
            out_channels=2,
        )

#change it to be torch script
model.load_state_dict(torch.load(os.path.join(settings.BASE_DIR ,'api/services/models/segmentation/checkpoint_swinunetr.pth'), weights_only=False)["model_state_dict"]) # This line uses .load() to read a .pth file and load the network weights on to the architecture.
model.eval()

def transform_image(image_path):
    transforms = Compose([
            LoadImage(image_only=True),
            EnsureType(),
            NormalizeIntensity(nonzero=True, channel_wise=True),
            ToTensor()
        ])
    
    image = transforms(image_path).unsqueeze(0)
    return image.unsqueeze(0)


def get_predicted_masks(image_path):
    tensor = transform_image(image_path)
    output = model(tensor)
    output = torch.argmax(output, dim=1).squeeze(0)
    output_remove_one_hot = output.cpu().numpy()
    return output_remove_one_hot
    
  