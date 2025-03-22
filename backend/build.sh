#!/bin/bash
echo "Downloading models from DigitalOcean Spaces..."

mkdir api/services/models/classification/
mkdir api/services/models/segmentation/

curl -o api/services/models/classification/checkpoint_resnet18.pth \
     "https://master-thesis-bucket.ams3.digitaloceanspaces.com/ML-models/checkpoint_resnet18.pth"

curl -o api/services/models/segmentation/checkpoint_swinunetrv2.pth \
     "https://master-thesis-bucket.ams3.digitaloceanspaces.com/ML-models/checkpoint_swinunetrv2.pth"

echo "Download complete!"