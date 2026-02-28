import os
import requests

HF_MODEL = "umm-maybe/AI-image-detector"
HF_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
HF_TOKEN = os.getenv("HF_API_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}"
}

def detect(image_bytes: bytes) -> float:
    response = requests.post(
        HF_URL,
        headers=HEADERS,
        files={"file": image_bytes},
        timeout=30
    )

    if response.status_code != 200:
        return 0.5

    result = response.json()

    if not isinstance(result, list):
        return 0.5

    for item in result:
        if item.get("label", "").lower().startswith("ai"):
            return float(item.get("score", 0.5))

    return 0.5
