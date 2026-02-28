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

import base64
import os
import tempfile
import traceback
from pathlib import Path
from typing import List, Set

# Load .env from yolo-service/ so ROBOFLOW_MODEL, USE_SAM3, etc. are set
try:
    from dotenv import load_dotenv
    _env_path = Path(__file__).resolve().parent / ".env"
    load_dotenv(_env_path, override=True)
except ImportError:
    pass

import requests
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

# Optional: use a Roboflow-hosted model by ID (e.g. ingredients-u1v6l/1). If set, we call
# Roboflow API instead of loading local YOLO. Get your API key from Roboflow dashboard.
ROBOFLOW_MODEL = os.environ.get("ROBOFLOW_MODEL", "").strip()  # e.g. "ingredients-u1v6l/1"
ROBOFLOW_API_KEY = os.environ.get("ROBOFLOW_API_KEY", "").strip()
USE_ROBOFLOW = bool(ROBOFLOW_MODEL and ROBOFLOW_API_KEY)
# Minimum confidence for Roboflow object-detection (0–1). Default 0.5 = 50%.
ROBOFLOW_CONFIDENCE = float(os.environ.get("ROBOFLOW_CONFIDENCE", "0.5"))

# SAM 3 via Roboflow serverless (set USE_SAM3=1 and ROBOFLOW_API_KEY).
_use_sam3 = os.environ.get("USE_SAM3", "").strip().lower() in ("1", "true", "yes")
USE_SAM3 = _use_sam3 and bool(ROBOFLOW_API_KEY)
SAM3_PROMPTS_RAW = os.environ.get("SAM3_PROMPTS", "").strip()
SAM3_PROMPTS_LIST: List[str] = [p.strip() for p in SAM3_PROMPTS_RAW.split(",") if p.strip()] if SAM3_PROMPTS_RAW else ["egg", "milk", "tomato", "onion", "carrot", "broccoli", "chicken", "cheese", "bread", "apple", "banana", "orange", "potato", "garlic", "lettuce", "pepper", "lemon", "avocado"]
SAM3_CONFIDENCE = float(os.environ.get("SAM3_CONFIDENCE", "0.4"))

# Use a food-specific model path if you have one; otherwise generic YOLOv8
_requested_path = os.environ.get("YOLO_MODEL_PATH", "yolov8n.pt")
if _requested_path and os.path.isfile(_requested_path):
    MODEL_PATH = _requested_path
else:
    if _requested_path and _requested_path != "yolov8n.pt":
        print(f"[yolo_service] YOLO_MODEL_PATH={_requested_path!r} not found, using default yolov8n.pt")
    MODEL_PATH = "yolov8n.pt"
_DEFAULT_COCO_MODEL = "yolov8n.pt"
IS_COCO_MODEL = os.path.basename(MODEL_PATH).lower() == _DEFAULT_COCO_MODEL.lower()

# When True, only return labels in COCO_FOOD_LABELS. When False, return all model classes.
# Default: filter ON for COCO (yolov8n.pt), OFF for custom models so food-model classes all show.
_filter_env = os.environ.get("YOLO_FOOD_ONLY", "").strip().lower()
if _filter_env:
    FILTER_FOOD_ONLY = _filter_env in ("1", "true", "yes")
else:
    FILTER_FOOD_ONLY = IS_COCO_MODEL  # default: filter only for default COCO model

# COCO 80: only these are returned when FILTER_FOOD_ONLY=1.
# - Food: the 10 COCO food classes (no "milk" or "egg" in COCO).
# - Containers: bottle, cup, bowl, wine glass (so milk carton → "bottle"). Fork, knife, spoon
#   are excluded so cutlery isn't returned as ingredients.
# Labels are matched after normalizing (lowercase, underscores → spaces).
COCO_FOOD_LABELS: Set[str] = {
    # COCO food (10 classes)
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    # Containers / drinks (milk→bottle, etc.)
    "bottle",
    "cup",
    "bowl",
    "wine glass",
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
    if USE_SAM3:
        print(f"[yolo_service] Using SAM 3 (Roboflow serverless), prompts={len(SAM3_PROMPTS_LIST)}")
    elif USE_ROBOFLOW:
        print(f"[yolo_service] Using Roboflow model: {ROBOFLOW_MODEL}")
    else:
        print(f"[yolo_service] MODEL_PATH={MODEL_PATH} (COCO={IS_COCO_MODEL}), FILTER_FOOD_ONLY={FILTER_FOOD_ONLY}")


@app.post("/detect")
async def detect(file: UploadFile = File(..., alias="image")):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Expected an image file")

    contents = await file.read()
    if not contents:
        raise HTTPException(400, "Empty image file")

    if USE_SAM3:
        return await _detect_sam3(contents)
    if USE_ROBOFLOW:
        return await _detect_roboflow(contents)

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

    # Collect class names and counts from detections
    ingredients: List[str] = []
    seen: Set[str] = set()
    counts: dict = {}
    for r in results:
        if r.boxes is None or not r.names:
            continue
        for cls_id in r.boxes.cls.int().tolist():
            label = r.names.get(int(cls_id), "").strip()
            if not label:
                continue
            normalized = _normalize_label(label)
            if FILTER_FOOD_ONLY:
                if not _is_food_label(normalized):
                    continue
            counts[normalized] = counts.get(normalized, 0) + 1
            if normalized not in seen:
                seen.add(normalized)
                ingredients.append(label)

    return {"ingredients": ingredients, "quantities": {n: c for n, c in counts.items()}}


async def _detect_sam3(image_bytes: bytes) -> dict:
    img_b64 = base64.b64encode(image_bytes).decode("ascii")
    url = "https://serverless.roboflow.com/sam3/concept_segment"
    params = {"api_key": ROBOFLOW_API_KEY}
    prompts_sent = SAM3_PROMPTS_LIST[:8]
    payload = {
        "image": {"type": "base64", "value": img_b64},
        "prompts": [{"type": "text", "text": p} for p in prompts_sent],
        "output_prob_thresh": SAM3_CONFIDENCE,
    }
    try:
        resp = requests.post(url, params=params, json=payload, timeout=60)
        if resp.status_code != 200:
            err_body = resp.text
            try:
                j = resp.json()
                err_body = j.get("message") or j.get("detail") or str(j) or err_body
            except Exception:
                pass
            raise HTTPException(502, f"SAM 3 API ({resp.status_code}): {err_body}")
        data = resp.json()
    except requests.RequestException as e:
        raise HTTPException(502, f"SAM 3 API error: {e}") from e
    ingredients = []
    for i, pr in enumerate(data.get("prompt_results") or []):
        if i >= len(prompts_sent):
            break
        prompt_text = prompts_sent[i]
        preds = pr.get("predictions") or []
        if any((p.get("confidence") or 0) >= SAM3_CONFIDENCE for p in preds if isinstance(p, dict)):
            ingredients.append(prompt_text)
    # SAM 3 doesn't give per-instance count; treat each as 1
    quantities = {_normalize_label(name): 1 for name in ingredients}
    return {"ingredients": ingredients, "quantities": quantities}


async def _detect_roboflow(image_bytes: bytes) -> dict:
    """Call Roboflow hosted API and return ingredients list."""
    img_b64 = base64.b64encode(image_bytes).decode("ascii")
    url = f"https://detect.roboflow.com/{ROBOFLOW_MODEL}"
    params = {"api_key": ROBOFLOW_API_KEY, "confidence": ROBOFLOW_CONFIDENCE}
    try:
        resp = requests.post(url, params=params, data=img_b64, headers={"Content-Type": "application/json"}, timeout=30)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        raise HTTPException(502, f"Roboflow API error: {e}") from e
    ingredients = []
    counts: dict = {}
    for p in (data.get("predictions") or []):
        if not isinstance(p, dict):
            continue
        label = (p.get("class") or p.get("class_name") or p.get("label") or "").strip()
        if not label:
            continue
        norm = _normalize_label(label)
        counts[norm] = counts.get(norm, 0) + 1
        if norm not in {_normalize_label(x) for x in ingredients}:
            ingredients.append(label)
    return {"ingredients": ingredients, "quantities": counts}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/info")
async def info():
    """Return which detection backend is active."""
    if USE_SAM3:
        return {"backend": "sam3", "message": "Using SAM 3 (Roboflow serverless)", "prompts_count": len(SAM3_PROMPTS_LIST)}
    if USE_ROBOFLOW:
        return {"backend": "roboflow", "message": f"Using Roboflow model: {ROBOFLOW_MODEL}", "model": ROBOFLOW_MODEL, "confidence": ROBOFLOW_CONFIDENCE}
    return {"backend": "yolo", "message": f"Using local YOLO: {MODEL_PATH}", "model_path": MODEL_PATH, "coco_filter": FILTER_FOOD_ONLY}
