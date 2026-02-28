import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const FiltersSchema = z.object({
  cuisine: z.string().optional().default("any"),
  skillLevel: z.string().optional().default("any"),
  cookTime: z.string().optional().default("any"),
  budget: z.string().optional().default("any"),
  mealTime: z.string().optional().default("any"),
});

const RequestSchema = z.object({
  ingredients: z.array(z.string()).min(1).max(30),
  filters: FiltersSchema.optional().default({}),
});

const RecipeSchema = z.object({
  name: z.string().min(1),
  cuisine: z.string().min(1),
  skillLevel: z.string().min(1),
  cookTime: z.string().min(1),
  budget: z.string().min(1),
  mealTime: z.string().min(1),
  ingredients: z.array(z.string()).min(1).max(40),
  instructions: z.array(z.string()).min(1).max(25),
  image: z.string().url().optional(),
});

const ResponseSchema = z.object({
  recipes: z.array(RecipeSchema).min(1).max(12),
});

function computeMatchPercentage(userIngredients: string[], recipeIngredients: string[]) {
  const users = userIngredients.map((s) => s.toLowerCase());
  const recipe = recipeIngredients.map((s) => s.toLowerCase());
  const matching = recipe.filter((ing) =>
    users.some((u) => u.includes(ing) || ing.includes(u)),
  );
  return Math.round((matching.length / recipe.length) * 100);
}

function extractJsonObject(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return valid JSON.");
  }
  return text.slice(start, end + 1);
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return extractJsonObject(trimmed);
  if (trimmed.startsWith("[")) {
    const end = trimmed.lastIndexOf("]");
    if (end === -1) throw new Error("Gemini did not return valid JSON.");
    return trimmed.slice(0, end + 1);
  }
  throw new Error("Gemini did not return valid JSON.");
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80";

function mapRecipeApiError(rawMessage: string) {
  const msg = rawMessage.toLowerCase();

  if (
    msg.includes("429") ||
    msg.includes("quota exceeded") ||
    msg.includes("rate limit")
  ) {
    return {
      status: 429,
      clientMessage:
        "Gemini API limit reached. Showing fallback recipes. Please try again shortly.",
    };
  }

  if (msg.includes("timed out")) {
    return {
      status: 504,
      clientMessage:
        "Recipe generation timed out. Showing fallback recipes. Please try again.",
    };
  }

  return {
    status: 500,
    clientMessage: "Recipe generation failed. Showing fallback recipes.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const ingredients = parsed.ingredients
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 30);

    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: "No ingredients provided" },
        { status: 400 },
      );
    }

    const targetRecipeCount = 4;
    const prompt = [
      "You are a recipe recommendation engine for a web app.",
      "Return ONLY valid JSON. No markdown, no extra keys, no commentary.",
      "",
      'Schema: {"recipes":[{"name":string,"cuisine":string,"skillLevel":string,"cookTime":string,"budget":string,"mealTime":string,"ingredients":[string],"instructions":[string],"image"?:string}]}',
      "",
      `User ingredients: ${ingredients.join(", ")}`,
      `User filters (strings, may be 'any'): ${JSON.stringify(parsed.filters)}`,
      "",
      "Constraints:",
      `- Provide exactly ${targetRecipeCount} recipes.`,
      "- Prefer recipes that use many of the user ingredients.",
      "- If you add ingredients not listed, keep them minimal and realistic.",
      "- Keep instructions short, safe, and practical.",
      "- For each recipe, provide 4-6 concise instruction steps.",
      "- cookTime format like: '15 mins', '45 mins'.",
      "- budget should be one of: low, moderate, high.",
      "- skillLevel should be one of: beginner, intermediate, advanced.",
      "- mealTime should be one of: breakfast, lunch, dinner, snack.",
    ].join("\n");

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    const timeoutMs = 20_000;

    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
          // responseSchema can cause 400 "too many states" if overly constrained;
          // keep JSON-only output and validate with Zod after parsing.
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timed out")), timeoutMs),
      ),
    ]);

    const raw = result.response.text();
    const jsonText = extractJson(raw);
    const parsedJson = JSON.parse(jsonText);
    const normalized =
      Array.isArray(parsedJson) ? { recipes: parsedJson } : (parsedJson as unknown);
    const modelData = ResponseSchema.parse(normalized);

    const recipes = modelData.recipes.map((r, idx) => ({
      id: idx + 1,
      ...r,
      image: r.image ?? FALLBACK_IMAGE,
      matchPercentage: computeMatchPercentage(ingredients, r.ingredients),
    }));

    return NextResponse.json({ recipes });
  } catch (e) {
    const rawMessage = e instanceof Error ? e.message : "Recipe generation failed";
    const mapped = mapRecipeApiError(rawMessage);
    return NextResponse.json({ error: mapped.clientMessage }, { status: mapped.status });
  }
}

