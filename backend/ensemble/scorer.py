from detectors.vit_detector import detect as vit_detect
from detectors.cnn_detector import detect as cnn_detect
from detectors.frequency_detector import detect as freq_detect

def compute_image_score(image_bytes: bytes) -> dict:
    vit_score = vit_detect(image_bytes)
    cnn_score = cnn_detect(image_bytes)
    freq_score = freq_detect(image_bytes)

    final_score = (
        vit_score * 0.40 +
        cnn_score * 0.35 +
        freq_score * 0.25
    )

    return {
        "final_score": round(final_score, 3),
        "signals": {
            "vit": round(vit_score, 3),
            "cnn": round(cnn_score, 3),
            "frequency": round(freq_score, 3)
        }
    }
