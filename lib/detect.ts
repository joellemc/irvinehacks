/**
 * Client-side helper to call the YOLO detection API with your image input.
 * Use this from any component or script that has a File (e.g. from an input or drag-and-drop).
 */

export interface DetectResult {
  ingredients: string[];
  quantities?: Record<string, number>;
}

export interface DetectError {
  error: string;
  details?: string;
}

const DETECT_TIMEOUT_MS = 12_000;

/**
 * Call the Next.js detect API with an image file.
 * Uses the app's /api/detect route (which forwards to YOLO if YOLO_SERVICE_URL is set).
 * Times out after 30 seconds so the UI doesn't hang if the service is slow or down.
 *
 * @param image - The image file (e.g. from <input type="file"> or drag-and-drop)
 * @param apiBase - Optional. Defaults to "" (same origin). Set to full URL to call a different host.
 * @returns List of detected ingredient labels and optional counts per ingredient
 * @throws On non-OK response or timeout (throws Error with message from API or "Detection timed out...")
 */
export async function detectIngredients(
  image: File,
  apiBase: string = "",
): Promise<{ ingredients: string[]; quantities: Record<string, number> }> {
  const url = apiBase ? `${apiBase.replace(/\/$/, "")}/api/detect` : "/api/detect";
  const formData = new FormData();
  formData.set("image", image, image.name || "image.jpg");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DETECT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      cache: "no-store",
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error("Detection timed out. You can add ingredients manually on the next page.");
    }
    throw e;
  }
  clearTimeout(timeoutId);

  const data = await res.json();

  if (!res.ok) {
    const err = data as DetectError;
    const message =
      res.status === 504
        ? "Detection timed out. You can add ingredients manually on the next page."
        : err.details ?? err.error ?? "Detection failed";
    throw new Error(message);
  }

  const result = data as DetectResult;
  const ingredients = Array.isArray(result.ingredients) ? result.ingredients : [];
  const quantities =
    result.quantities && typeof result.quantities === "object" ? result.quantities : {};
  return { ingredients, quantities };
}
