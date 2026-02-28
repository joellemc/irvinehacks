"""
Minimal YOLO detection service for the food-recipe app.

Run:
  pip install ultralytics fastapi uvicorn python-multipart
  uvicorn yolo_service:app --reload --port 8000

Then set in .env:
  YOLO_SERVICE_URL=http://localhost:8000/detect

Uses a generic YOLO model (yolov8n) by default. For food-specific detection,
train or download a food-trained model and set MODEL_PATH or use --model in CLI.
"""

import os
import tempfile
import traceback
from typing import List, Set

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="YOLO Detect")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use a food-specific model path if you have one; otherwise generic YOLOv8
MODEL_PATH = os.environ.get("YOLO_MODEL_PATH", "yolov8n.pt")

# When True (default), only return labels in COCO_FOOD_LABELS. Set to "0" to return all detections.
_filter_env = os.environ.get("YOLO_FOOD_ONLY", "1").strip().lower()
FILTER_FOOD_ONLY = _filter_env in ("1", "true", "yes")

# COCO 80 classes that are actual food (no utensils: fork, knife, spoon, bowl, cup, bottle, wine glass).
COCO_FOOD_LABELS: Set[str] = {
    "banana", "apple", "sandwich", "orange", "broccoli", "carrot",
    "hot dog", "hot_dog", "pizza", "donut", "cake",
}


def _normalize_label(label: str) -> str:
    """Lowercase and normalize spaces/underscores for consistent matching."""
    return label.strip().lower().replace("_", " ")


def _is_food_label(normalized: str) -> bool:
    """True if this label is in our food/drink allowlist."""
    return normalized in COCO_FOOD_LABELS or normalized.replace(" ", "_") in COCO_FOOD_LABELS


def get_model():
    from ultralytics import YOLO
    return YOLO(MODEL_PATH)


@app.on_event("startup")
def _log_filter_status():
    print(f"[yolo_service] FILTER_FOOD_ONLY={FILTER_FOOD_ONLY} (only food/drink labels when True)")


@app.post("/detect")
async def detect(file: UploadFile = File(..., alias="image")):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Expected an image file")

    contents = await file.read()
    if not contents:
        raise HTTPException(400, "Empty image file")

    try:
        model = get_model()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Failed to load YOLO model: {e}") from e

    # Ultralytics predict() works reliably with a file path; BytesIO can be flaky
    suffix = os.path.splitext(file.filename or "")[1] or ".jpg"
    if not suffix.lower().startswith("."):
        suffix = ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        results = model.predict(
            source=tmp_path,
            verbose=False,
            stream=False,
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"YOLO predict failed: {e}") from e
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass

    # Collect unique class names (labels) from detections
    ingredients: List[str] = []
    seen: Set[str] = set()
    for r in results:
        if r.boxes is None or not r.names:
            continue
        for cls_id in r.boxes.cls.int().tolist():
            label = r.names.get(int(cls_id), "").strip()
            if not label:
                continue
            normalized = _normalize_label(label)
            if normalized in seen:
                continue
            # If filtering for food only, skip non-food COCO classes
            if FILTER_FOOD_ONLY:
                if not _is_food_label(normalized):
                    continue
            seen.add(normalized)
            ingredients.append(label)

    return {"ingredients": ingredients}


@app.get("/health")
async def health():
    return {"status": "ok"}
