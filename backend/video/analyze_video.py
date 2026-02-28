import cv2
import tempfile
from ensemble.scorer import compute_image_score
from metadata.exif_check import check_metadata

def analyze_video(video_path: str) -> dict:
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    frame_count = 0
    ai_frames = 0
    uncertain_frames = 0

    frame_index = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # 1 frame per second
        if frame_index % fps == 0:
            frame_count += 1

            _, buffer = cv2.imencode(".jpg", frame)
            image_bytes = buffer.tobytes()

            image_result = compute_image_score(image_bytes)
            score = image_result["final_score"]

            metadata = check_metadata(image_bytes)
            if metadata["exif_missing"]:
                score += 0.05
            if metadata["ai_software_tag"]:
                score += 0.10
            if metadata["c2pa_present"]:
                score -= 0.15

            score = max(0.0, min(1.0, score))

            if score >= 0.65:
                ai_frames += 1
            elif score >= 0.45:
                uncertain_frames += 1

        frame_index += 1

    cap.release()

    if frame_count == 0:
        return {"verdict": "Uncertain", "confidence": "0%"}

    ai_ratio = ai_frames / frame_count

    if ai_ratio >= 0.6:
        verdict = "Likely AI-generated video"
    elif ai_ratio >= 0.4:
        verdict = "Uncertain video"
    else:
        verdict = "Likely real video"

    return {
        "verdict": verdict,
        "confidence": f"{int(ai_ratio * 100)}%",
        "frames_analyzed": frame_count
    }
