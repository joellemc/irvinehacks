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
