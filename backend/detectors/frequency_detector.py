import io
import numpy as np
from PIL import Image

def detect(image_bytes: bytes) -> float:
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("L")
        img_array = np.array(image)

        fft = np.fft.fft2(img_array)
        fft_shift = np.fft.fftshift(fft)
        magnitude = np.abs(fft_shift)

        h, w = magnitude.shape
        center = magnitude[h//2-10:h//2+10, w//2-10:w//2+10]
        mean_center = np.mean(center)
        mean_total = np.mean(magnitude)

        ratio = mean_center / (mean_total + 1e-6)

        # Heuristic normalization
        score = min(max((ratio - 0.6) * 2.5, 0.0), 1.0)
        return score

    except Exception:
        return 0.5
