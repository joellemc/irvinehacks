# YOLO detection service

Optional Python service that runs Ultralytics YOLO on uploaded images and returns detected labels as ingredients.

## Quick start

```bash
cd yolo-service
pip install -r requirements.txt
uvicorn yolo_service:app --reload --port 8000
```

In the Next.js project root, add to `.env`:

```env
YOLO_SERVICE_URL=http://localhost:8000/detect
```

Restart `npm run dev`. When you click "Analyze my food", the image is sent to this service and the returned labels appear on the review page.

---

## Food-only output (default with COCO model)

When you use the **default COCO model** (`yolov8n.pt`), the service only returns **food/drink-related** COCO classes so you don’t get “person”, “car”, etc.

**Included:** banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, plus bottle, cup, wine glass, bowl (so milk-in-bottle can return “bottle”).

**Not in COCO:** The 80-class model has no “milk” or “egg” labels, so those will never appear. You may get “bottle”/“cup” for milk containers, or a wrong label (e.g. “orange”) if the model misdetects. For real milk/egg detection, use a food-trained model (see below).

- **Turn filtering off** (return all 80 COCO classes):  
  `YOLO_FOOD_ONLY=0 uvicorn yolo_service:app --reload --port 8000`
- **Turn filtering on** (default when using COCO):  
  `YOLO_FOOD_ONLY=1` or omit it.

When you use a **custom (food) model** via `YOLO_MODEL_PATH`, filtering is **off by default** so every class from that model is returned (e.g. milk, egg, tomato). You can set `YOLO_FOOD_ONLY=1` to restrict to a allowlist if needed.

---

## Use a food model (for milk, egg, and accurate ingredients)

**Seeing only "orange" (or wrong labels) for milk and eggs?** The default COCO model has no "milk" or "egg" classes and often misclassifies. Use a food/ingredients model (steps below).

### Use SAM 3 (Segment Anything Model 3)

To use **SAM 3** instead of YOLO or a Roboflow object-detection model, set:

- `USE_SAM3=1`
- `ROBOFLOW_API_KEY=your_roboflow_api_key`

The service will call Roboflow’s serverless SAM 3 API with text prompts (e.g. egg, milk, tomato) and return which ingredients were detected. No local GPU or .pt file is required.

```bash
cd yolo-service
export USE_SAM3=1
export ROBOFLOW_API_KEY=your_key
uvicorn yolo_service:app --reload --port 8000
```

Optional env vars:

- **SAM3_PROMPTS** – Comma-separated list of ingredient prompts (default: egg, milk, tomato, onion, carrot, …).
- **SAM3_CONFIDENCE** – Minimum confidence (default 0.4).

### Option A: Pre-trained food model from Roboflow (fastest)

1. **Find a model**  
   Go to [Roboflow Universe](https://universe.roboflow.com) and search for **"food detection"** or **"ingredients detection"** and filter for YOLOv8.

   Example: [Ingredients detection YoloV8](https://universe.roboflow.com/test-model-rqcm2/ingredients-detection-yolov8) (31 food classes).

2. **Download the weights**  
   - Open the model page → **Download** or **Export**.  
   - Choose **YOLOv8** and download the `.pt` file (or a zip that contains it).  
   - Put the `.pt` file in `yolo-service/`, e.g. `yolo-service/food_model.pt`.

3. **Point the service at it**  
   From the `yolo-service` folder (filtering is automatically off for custom models):

   ```bash
   YOLO_MODEL_PATH=./food_model.pt uvicorn yolo_service:app --reload --port 8000
   ```

   Or set the path to wherever you saved the file:

   ```bash
   YOLO_MODEL_PATH=/path/to/your/food_model.pt uvicorn yolo_service:app --reload --port 8000
   ```

4. **Test**  
   Upload a food photo in the app and click “Analyze my food”. The review page should show the model’s class names (e.g. tomato, egg, bread) as ingredients.

### Option B: Train from the GreenKitchen ingredients dataset

The [GreenKitchen ingredients dataset](https://universe.roboflow.com/greenkitchen/ingredients-u1v6l) is a **dataset** (images + labels), not a pre-trained `.pt`. You download it in YOLOv8 format, train a model, then use the trained weights.

1. **Download**
   - Open: https://universe.roboflow.com/greenkitchen/ingredients-u1v6l/dataset/3
   - Click **Download Dataset** → choose **YOLOv8** → download the zip (free Roboflow account may be required).
   - Unzip (e.g. `~/Downloads/ingredients-yolov8`). You should see `train/`, `valid/`, `test/`, and `data.yaml`.

2. **Train**
   ```bash
   pip install ultralytics
   cd /path/to/ingredients-yolov8
   yolo detect train data=data.yaml model=yolov8n.pt epochs=50 imgsz=640
   ```
   When done, weights are in `runs/detect/train/weights/best.pt`.

3. **Use with the service**
   ```bash
   cp runs/detect/train/weights/best.pt /Users/joellechan/Desktop/irvinehacks/yolo-service/ingredients_model.pt
   cd /Users/joellechan/Desktop/irvinehacks/yolo-service
   YOLO_MODEL_PATH=./ingredients_model.pt uvicorn yolo_service:app --reload --port 8000
   ```
   The dataset has 26 classes (egg, tomato, chicken, carrot, onion, etc.), so your app can return labels like "egg" for ingredient detection.

### Option C: Train your own model (other datasets)

1. **Dataset**  
   Use a public food dataset (e.g. from Roboflow or [UEC Food 100/256](https://paperswithcode.com/dataset/uec-food-256)) in YOLO format (images + labels).

2. **Train with Ultralytics**  
   Example (run from a folder that has your `data.yaml`):

   ```bash
   pip install ultralytics
   yolo detect train data=data.yaml model=yolov8n.pt epochs=50
   ```

   The best weights are saved under `runs/detect/train/weights/best.pt`.

3. **Use the trained weights**  
   Copy `best.pt` into `yolo-service/` (or note its path) and run the service with:

   ```bash
   YOLO_MODEL_PATH=./best.pt uvicorn yolo_service:app --reload --port 8000
   ```

### Summary

| Step | Action |
|------|--------|
| 1 | Get a food YOLOv8 `.pt` (Roboflow or your own training). |
| 2 | Run the service with `YOLO_MODEL_PATH=/path/to/model.pt`. |
| 3 | No changes needed in Next.js; the app already calls the service and shows returned labels on the review page. |

---

## API

- **POST /detect** – `multipart/form-data` with field `image` (file). Returns `{ "ingredients": ["label1", "label2", ...] }`.
- **GET /health** – Returns `{ "status": "ok" }`.
