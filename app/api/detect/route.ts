import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

/** Max dimension for image sent to Roboflow to avoid 413 Request Entity Too Large */
const ROBOFLOW_MAX_SIZE = 1280;
const ROBOFLOW_JPEG_QUALITY = 82;

/**
 * POST /api/detect
 * Body: FormData with key "image" (File)
 * Returns: { ingredients: string[], quantities?: Record<string, number> }
 *
 * Detection order:
 * 1. USE_MOCK_DETECT=1 → return mock immediately (no external calls). Use when upload hangs.
 * 2. Roboflow: if ROBOFLOW_MODEL + ROBOFLOW_API_KEY are set → call detect.roboflow.com.
 * 3. YOLO service: if YOLO_SERVICE_URL is set → forward to Python service.
 * 4. Otherwise: return mock ingredients.
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

    // Return mock immediately so upload never hangs (set in .env when Roboflow is slow/unreachable)
    if (process.env.USE_MOCK_DETECT === "1") {
      return NextResponse.json({
        ingredients: ["Tomatoes", "Eggs", "Cheese", "Lettuce", "Onions", "Bell peppers", "Chicken breast", "Garlic"],
      });
    }

    const roboflowModel = process.env.ROBOFLOW_MODEL?.trim();
    const roboflowApiKey = process.env.ROBOFLOW_API_KEY?.trim();
    const roboflowConfidence = process.env.ROBOFLOW_CONFIDENCE?.trim() || "0.5";

    // 1. Call Roboflow hosted API when keys are set (no Python service needed)
    if (roboflowModel && roboflowApiKey) {
      const arrayBuffer = await (file as Blob).arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      let imgB64: string;
      try {
        const processed = await sharp(inputBuffer)
          .resize(ROBOFLOW_MAX_SIZE, ROBOFLOW_MAX_SIZE, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: ROBOFLOW_JPEG_QUALITY })
          .toBuffer();
        imgB64 = processed.toString("base64");
      } catch (e) {
        console.warn("[detect] Sharp resize failed, using original image:", e instanceof Error ? e.message : e);
        imgB64 = inputBuffer.toString("base64");
      }

      const roboflowUrl = `https://detect.roboflow.com/${roboflowModel}?api_key=${encodeURIComponent(roboflowApiKey)}&confidence=${encodeURIComponent(roboflowConfidence)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10_000);

      let res: Response;
      try {
        res = await fetch(roboflowUrl, {
          method: "POST",
          body: imgB64,
          signal: controller.signal,
          cache: "no-store",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
      } catch (e) {
        clearTimeout(timeoutId);
        console.warn("[detect] Roboflow request failed or timed out:", e instanceof Error ? e.message : e);
        const mock = ["Tomatoes", "Eggs", "Cheese", "Lettuce", "Onions", "Bell peppers", "Chicken breast", "Garlic"];
        return NextResponse.json({ ingredients: mock });
      }
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        console.warn("[detect] Roboflow API error:", res.status, text?.slice(0, 150));
        const mock = ["Tomatoes", "Eggs", "Cheese", "Lettuce", "Onions", "Bell peppers", "Chicken breast", "Garlic"];
        return NextResponse.json({ ingredients: mock });
      }

      let data: { predictions?: Array<{ class?: string; class_name?: string; label?: string }> };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        const mock = ["Tomatoes", "Eggs", "Cheese", "Lettuce", "Onions", "Bell peppers", "Chicken breast", "Garlic"];
        return NextResponse.json({ ingredients: mock });
      }

      const ingredients: string[] = [];
      const quantities: Record<string, number> = {};
      const seen = new Set<string>();
      const norm = (s: string) => s.trim().toLowerCase().replace(/_/g, " ");
      for (const p of data.predictions || []) {
        const label = (p.class ?? p.class_name ?? p.label ?? "").trim();
        if (!label) continue;
        const n = norm(label);
        quantities[n] = (quantities[n] ?? 0) + 1;
        if (!seen.has(n)) {
          seen.add(n);
          ingredients.push(label);
        }
      }
      console.log("[detect] Roboflow returned", ingredients.length, "ingredients for model", roboflowModel);
      return NextResponse.json(
        { ingredients, quantities },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" } },
      );
    }

    // 2. Forward to Python YOLO service if URL is set
    const pythonServiceUrl = process.env.YOLO_SERVICE_URL?.trim();
    const YOLO_TIMEOUT_MS = 10_000;

    if (pythonServiceUrl) {
      // On Vercel, skip localhost (not reachable)
      const isVercel = typeof process.env.VERCEL === "string";
      const isLocalhost = /^https?:\/\/localhost(\b|:)/i.test(pythonServiceUrl);
      if (isVercel && isLocalhost) {
        console.log("[detect] YOLO_SERVICE_URL is localhost — skipping on Vercel, returning mock");
        return NextResponse.json({ ingredients: ["Tomatoes", "Eggs", "Cheese", "Lettuce", "Onions", "Bell peppers", "Chicken breast", "Garlic"] });
      }
      // Forward to Python YOLO service
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

    // 3. No Roboflow or YOLO: return mock
    console.log("[detect] No ROBOFLOW_MODEL/ROBOFLOW_API_KEY or YOLO_SERVICE_URL — returning mock ingredients");
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
