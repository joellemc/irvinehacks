import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/detect
 * Body: FormData with key "image" (File)
 * Returns: { ingredients: string[] }
 *
 * Integrates with YOLO in one of two ways:
 * 1. Set YOLO_SERVICE_URL (e.g. http://localhost:8000/detect) to a Python
 *    service that runs Ultralytics YOLO and returns { "ingredients": ["egg", "tomato", ...] }.
 * 2. Or implement detection here (e.g. with ONNX runtime or a third-party API).
 * Until then, returns mock ingredients so the flow works.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing or invalid image file" },
        { status: 400 },
      );
    }

    const pythonServiceUrl = process.env.YOLO_SERVICE_URL;

const YOLO_TIMEOUT_MS = 30_000;

    if (pythonServiceUrl) {
      // Forward to your Python YOLO service (Ultralytics) with a 30s timeout
      const fd = new FormData();
      fd.set("image", file, (file as File).name || "image.jpg");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), YOLO_TIMEOUT_MS);

      let res: Response;
      try {
        res = await fetch(pythonServiceUrl, {
          method: "POST",
          body: fd,
          signal: controller.signal,
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });
      } catch (e) {
        clearTimeout(timeoutId);
        if (e instanceof Error && e.name === "AbortError") {
          return NextResponse.json(
            { error: "Detection timed out. The service took too long to respond." },
            { status: 504 },
          );
        }
        throw e;
      }
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        console.error("YOLO service error:", res.status, text);
        return NextResponse.json(
          { error: "Detection service error", details: text },
          { status: 502 },
        );
      }

      const data = await res.json();
      const ingredients =
        Array.isArray(data.ingredients) ? data.ingredients : data.labels ?? [];
      const quantities =
        data.quantities && typeof data.quantities === "object" ? data.quantities : {};
      console.log("[detect] YOLO service returned", ingredients.length, "items");
      return NextResponse.json(
        { ingredients, quantities },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
          },
        },
      );
    }

    // No YOLO service configured: return mock detections so you can test the flow.
    console.log("[detect] YOLO_SERVICE_URL not set — returning mock ingredients");
    // Replace this block with real detection (e.g. ONNX in Node) or always use YOLO_SERVICE_URL.
    const mockIngredients = [
      "Tomatoes",
      "Eggs",
      "Cheese",
      "Lettuce",
      "Onions",
      "Bell peppers",
      "Chicken breast",
      "Garlic",
    ];
    return NextResponse.json({ ingredients: mockIngredients });
  } catch (e) {
    console.error("Detect API error:", e);
    return NextResponse.json(
      { error: "Detection failed" },
      { status: 500 },
    );
  }
}
