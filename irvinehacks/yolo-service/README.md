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

**Included:** banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, bottle, wine glass, cup, fork, knife, spoon, bowl.

- **Turn filtering off** (return all 80 COCO classes):  
  `YOLO_FOOD_ONLY=0 uvicorn yolo_service:app --reload --port 8000`
- **Turn filtering on** (default):  
  `YOLO_FOOD_ONLY=1` or omit it.

When you use a **food-trained model** (e.g. from Roboflow), set `YOLO_FOOD_ONLY=0` so every class from that model is returned (they’re already food).

---

## Use a real (food) YOLO model

The default `yolov8n.pt` is trained on COCO (cars, people, bottles, etc.), not food. To get actual food/ingredient detection:

### Option A: Pre-trained food model from Roboflow (fastest)

1. **Find a model**  
   Go to [Roboflow Universe](https://universe.roboflow.com) and search for **"food detection"** or **"ingredients detection"** and filter for YOLOv8.

   Example: [Ingredients detection YoloV8](https://universe.roboflow.com/test-model-rqcm2/ingredients-detection-yolov8) (31 food classes).

2. **Download the weights**  
   - Open the model page → **Download** or **Export**.  
   - Choose **YOLOv8** and download the `.pt` file (or a zip that contains it).  
   - Put the `.pt` file in `yolo-service/`, e.g. `yolo-service/food_model.pt`.

3. **Point the service at it**  
   From the `yolo-service` folder:

   ```bash
   YOLO_MODEL_PATH=./food_model.pt uvicorn yolo_service:app --reload --port 8000
   ```

   Or set the path to wherever you saved the file:

   ```bash
   YOLO_MODEL_PATH=/path/to/your/food_model.pt uvicorn yolo_service:app --reload --port 8000
   ```

4. **Test**  
   Upload a food photo in the app and click “Analyze my food”. The review page should show the model’s class names (e.g. tomato, egg, bread) as ingredients.

### Option B: Train your own model

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
