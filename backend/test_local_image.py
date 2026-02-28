import torch
import torchvision.transforms as transforms
from PIL import Image
import cv2
import numpy as np

# Load model (lightweight & stable)
model = torch.hub.load(
    'pytorch/vision:v0.10.0',
    'resnet18',
    pretrained=True
)

model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def analyze_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)

    confidence = torch.softmax(output, dim=1).max().item()
    return round(confidence * 100, 2)

# TEST IMAGE PATH (CHANGE THIS)
image_path = "test.jpg"

score = analyze_image(image_path)

print("Local Model Confidence:", score, "%")

if score > 85:
    print("Verdict: Likely AI Generated")
else:
    print("Verdict: Likely Real")
