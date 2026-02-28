# Use your own Roboflow-trained model in this app

You can train a custom model on Roboflow and plug it in with **two env vars**. No code changes are required.

---

## Overview

| Step | Where | What |
|------|--------|------|
| 1 | Roboflow | Create project, add images, annotate, train a model |
| 2 | Roboflow | Copy your **model ID** (e.g. `my-ingredients/3`) and **API key** |
| 3 | This repo | Set `ROBOFLOW_MODEL` and `ROBOFLOW_API_KEY` in `yolo-service/.env` |
| 4 | Terminal | Restart the YOLO service; use the app as usual |

The app already calls Roboflow’s inference API when those env vars are set. Your trained model’s class names become the “ingredients” list.

---

## Step 1: Train a model on Roboflow

### 1.1 Create a Roboflow account and project

1. Go to [Roboflow](https://roboflow.com) and sign in (or create an account).
2. **Create a new project**: Dashboard → **Create New Project**.
3. Choose **Object Detection** (for bounding boxes around ingredients/food).
4. Name the project (e.g. `my-food-ingredients`) and create it.

### 1.2 Add and annotate images

1. **Upload images** of the food/ingredients you want to detect (e.g. egg, milk, tomato).
2. **Annotate**: draw boxes around each ingredient and assign a **class name** (e.g. `egg`, `milk`, `tomato`). Use consistent class names; these will become your “ingredients” in the app.
3. **Split**: let Roboflow create Train / Valid / Test splits (e.g. 70/20/10).

Tip: You can start with 50–100 images per class; more (and variety) usually improves accuracy.

### 1.3 Generate a dataset version and train

1. In the project, open **Generate** (or **Create Version**). Apply any augmentations you want (e.g. flip, brightness).
2. Click **Generate** to create a dataset version (e.g. Version 1).
3. Go to **Train** (or **Train a Model**). Pick a model type (e.g. **YOLOv8**) and start training. Training runs in the cloud; you’ll get an email or in-app notice when it’s done.

### 1.4 Deploy / get the model ID

1. When training finishes, open the trained **version** (e.g. Version 2 or 3).
2. Go to **Deploy** or **Inference**.
3. Copy the **model ID**. It looks like:
   - `workspace-name/project-name/VERSION`, or  
   - `project-name/VERSION`  
   Example: `my-ingredients/2` or `joellechan/my-food/3`.

You’ll use this as `ROBOFLOW_MODEL` below.

---

## Step 2: Get your API key

1. In Roboflow: click your profile (top right) → **Settings** (or [Roboflow API](https://app.roboflow.com/settings/api)).
2. Copy your **Roboflow API key** (private key).  
   You’ll use this as `ROBOFLOW_API_KEY` below.

---

## Step 3: Point this app at your model

1. Open **`yolo-service/.env`** (create it from `yolo-service/.env.example` if needed).

2. Set:
   ```bash
   ROBOFLOW_MODEL=your-project-name/version
   ROBOFLOW_API_KEY=your_roboflow_api_key
   ```
   Use the **exact** model ID from Step 1.4 (e.g. `my-ingredients/2`).

3. If you were using SAM 3 before, turn it off so the app uses your object-detection model instead:
   ```bash
   # Comment out or remove:
   # USE_SAM3=1
   ```

4. Save the file.

---

## Step 4: Restart the service and verify

1. Restart the YOLO service (from the project root or `yolo-service/`):
   ```bash
   cd yolo-service
   uvicorn yolo_service:app --reload --port 8000
   ```

2. **Check which backend is active:**
   ```bash
   curl -s http://localhost:8000/info
   ```
   You should see something like:
   ```json
   {"backend":"roboflow","message":"Using Roboflow model: your-project-name/2","model":"your-project-name/2"}
   ```

3. **Test with an image:**
   ```bash
   curl -s -X POST http://localhost:8000/detect -F "image=@/path/to/your/food-photo.jpg"
   ```
   The response should list your model’s class names as `ingredients`, e.g. `["egg","tomato"]`.

4. Use the **Next.js app** as usual: upload a photo → Analyze → the review page will show the ingredients from your trained model.

---

## Switching between models

| Goal | What to set in `yolo-service/.env` |
|------|-------------------------------------|
| Use **your trained Roboflow model** | `ROBOFLOW_MODEL=project/version`, `ROBOFLOW_API_KEY=...`, and do **not** set `USE_SAM3=1` |
| Use **another Roboflow model** | Change `ROBOFLOW_MODEL` to the other project/version; keep `ROBOFLOW_API_KEY` |
| Use **SAM 3** | `USE_SAM3=1` and `ROBOFLOW_API_KEY=...` (no need for `ROBOFLOW_MODEL`) |
| Use **local YOLO** (e.g. COCO or a .pt file) | Unset or comment out `ROBOFLOW_MODEL`, `ROBOFLOW_API_KEY`, and `USE_SAM3`; optionally set `YOLO_MODEL_PATH` |

After any change, restart the YOLO service and check `curl http://localhost:8000/info`.

---

## Summary

- **Train** on Roboflow (upload images, annotate, train, get model ID).
- **Integrate** by setting `ROBOFLOW_MODEL` and `ROBOFLOW_API_KEY` in `yolo-service/.env`.
- **No code changes** in the Next.js app or the Python service; the existing `/detect` flow already uses the Roboflow API when those env vars are set.
- **Verify** with `GET /info` and `POST /detect` with a test image.
