import io
from PIL import Image
from PIL.ExifTags import TAGS

AI_KEYWORDS = [
    "stable diffusion",
    "dall-e",
    "midjourney",
    "firefly",
    "generative"
]

def check_metadata(image_bytes: bytes) -> dict:
    exif_missing = True
    ai_software_tag = False
    c2pa_present = False

    try:
        image = Image.open(io.BytesIO(image_bytes))
        exif_data = image.getexif()

        if exif_data:
            exif_missing = False

            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                value_str = str(value).lower()

                if tag in ["Software", "ProcessingSoftware", "CreatorTool"]:
                    for keyword in AI_KEYWORDS:
                        if keyword in value_str:
                            ai_software_tag = True

        # Simple heuristic for C2PA (future extensible)
        if "c2pa" in str(image.info).lower():
            c2pa_present = True

    except Exception:
        pass

    return {
        "exif_missing": exif_missing,
        "ai_software_tag": ai_software_tag,
        "c2pa_present": c2pa_present
    }
