# YOLO detection API – calling with your input

You can send an image to YOLO (via the Next.js API or directly to the Python service) from the app, a script, or any HTTP client.

---

## 1. From the app (React / browser)

Your input is an image **File** (e.g. from `<input type="file">` or drag-and-drop).

### Using the helper (recommended)

```ts
import { detectIngredients } from "@/lib/detect";

// image is a File (e.g. from state after user upload)
const ingredients = await detectIngredients(image);
console.log(ingredients); // ["tomato", "egg", "bread", ...]
```

### Using fetch directly

```ts
const formData = new FormData();
formData.set("image", imageFile, imageFile.name || "image.jpg");

const res = await fetch("/api/detect", { method: "POST", body: formData });
const data = await res.json();

if (!res.ok) throw new Error(data.error ?? "Detection failed");
const ingredients = data.ingredients; // string[]
```

---

## 2. From Node / server / script

Same as above, but use the **full URL** of your app or the Python service.

### Next.js API (same host or deployed URL)

```ts
const formData = new FormData();
formData.set("image", imageFile, "photo.jpg");

const res = await fetch("https://your-app.vercel.app/api/detect", {
  method: "POST",
  body: formData,
});
const { ingredients } = await res.json();
```

### Direct to Python YOLO service

```ts
const res = await fetch("http://localhost:8000/detect", {
  method: "POST",
  body: formData, // FormData with key "image"
});
const { ingredients } = await res.json();
```

---

## 3. With cURL (file on disk)

### Next.js API

```bash
curl -X POST http://localhost:3000/api/detect \
  -F "image=@/path/to/your/photo.jpg"
```

### Python YOLO service

```bash
curl -X POST http://localhost:8000/detect \
  -F "image=@/path/to/your/photo.jpg"
```

Response: `{"ingredients":["label1","label2",...]}`

---

## Request / response

| Endpoint            | Method | Body                    | Response                |
|---------------------|--------|-------------------------|-------------------------|
| `/api/detect`        | POST   | `FormData`, key `image` | `{ "ingredients": [] }` |
| `http://localhost:8000/detect` | POST   | `FormData`, key `image` | `{ "ingredients": [] }` |

Your input is always the **image file** under the form field **`image`**. The API returns a list of detected labels (ingredients) as strings.

---

## Verify YOLO is really running (not mock)

The Next.js app returns **mock ingredients** (same 8 items every time) when `YOLO_SERVICE_URL` is not set or the Python service is unreachable. Use these checks to confirm real YOLO is used.

1. **Env**  
   In `.env` you must have:
   ```bash
   YOLO_SERVICE_URL=http://localhost:8000/detect
   ```
   Restart the Next dev server after changing `.env`.

2. **YOLO service health**  
   With the Python service running (`uvicorn yolo_service:app --reload --port 8000`):
   ```bash
   curl http://localhost:8000/health
   ```
   Expected: `{"status":"ok"}`. If connection refused, the YOLO service is not running.

3. **Call YOLO directly**  
   Bypass Next.js and hit the Python service with an image:
   ```bash
   curl -s -X POST http://localhost:8000/detect -F "image=@/path/to/any/photo.jpg"
   ```
   You should get `{"ingredients":["...", ...]}`. Different images should give different lists (or empty). The default model is COCO (80 classes); only a subset are treated as "food" and returned (e.g. banana, apple, pizza, carrot).

4. **Next.js server log**  
   When you run "Analyze" in the app, check the terminal where `npm run dev` is running:
   - **Real YOLO:** `[detect] YOLO service returned N items`
   - **Mock:** `[detect] YOLO_SERVICE_URL not set — returning mock ingredients`

5. **Different image → different list**  
   Mock is always: Tomatoes, Eggs, Cheese, Lettuce, Onions, Bell peppers, Chicken breast, Garlic. If you upload different photos and always get exactly that list, the app is still using the mock. Real YOLO will vary by image (or return fewer/more items, or empty).
