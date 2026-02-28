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
  filters: FiltersSchema.optional().default({
    cuisine: "any",
    skillLevel: "any",
    cookTime: "any",
    budget: "any",
    mealTime: "any",
  }),
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

const IMAGE_LIBRARY = {
  breakfast:
    "https://images.unsplash.com/photo-1729223921247-c85b9b1a8ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBvbWVsZXQlMjB0b2FzdHxlbnwxfHx8fDE3NzIyNTQzMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  salad:
    "https://images.unsplash.com/photo-1633618309834-665b69ca6bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzcyMjU0MzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  veggies:
    "https://images.unsplash.com/photo-1760445529098-949fcfc7c9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGluZ3JlZGllbnRzJTIwa2l0Y2hlbiUyMGNvdW50ZXJ8ZW58MXx8fHwxNzcyMTc2NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  stirFry:
    "https://images.unsplash.com/photo-1761314025701-34795be5f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwc3RpciUyMGZyeSUyMGFzaWFufGVufDF8fHx8MTc3MjEzMjQ5OHww&ixlib=rb-4.1.0&q=80&w=1080",
  soup:
    "https://images.unsplash.com/photo-1553881781-4c55163dc5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBzb3VwJTIwYnJlYWR8ZW58MXx8fHwxNzcyMjU0MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
  protein:
    "https://images.unsplash.com/photo-1633524792246-f25f5b0d66dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NzIyNDkxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  pasta:
    "https://images.unsplash.com/photo-1627207644206-a2040d60ecad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYSUyMGRpc2h8ZW58MXx8fHwxNzcyMTg5ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  smoothie:
    "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=1080&q=80",
} as const;

const IMAGE_KEYWORDS: Array<{ keywords: string[]; image: string }> = [
  { keywords: ["smoothie", "shake", "juice"], image: IMAGE_LIBRARY.smoothie },
  { keywords: ["salad", "greens", "vinaigrette"], image: IMAGE_LIBRARY.salad },
  { keywords: ["taco", "tortilla", "burrito", "wrap", "quesadilla"], image: IMAGE_LIBRARY.veggies },
  { keywords: ["pasta", "carbonara", "spaghetti", "penne", "mac"], image: IMAGE_LIBRARY.pasta },
  { keywords: ["stir fry", "stir-fry", "fried rice", "noodle", "soy sauce"], image: IMAGE_LIBRARY.stirFry },
  { keywords: ["soup", "broth", "bisque", "chowder"], image: IMAGE_LIBRARY.soup },
  { keywords: ["salmon", "fish", "seafood"], image: IMAGE_LIBRARY.protein },
  { keywords: ["omelet", "scramble", "egg", "breakfast", "yogurt"], image: IMAGE_LIBRARY.breakfast },
  { keywords: ["chicken", "beef", "pork", "tofu"], image: IMAGE_LIBRARY.protein },
  { keywords: ["roast", "roasted", "bake", "baked", "cauliflower", "broccoli"], image: IMAGE_LIBRARY.veggies },
];

function resolveRecipeImage(recipe: z.infer<typeof RecipeSchema>) {
  const haystack = [
    recipe.name,
    recipe.cuisine,
    recipe.mealTime,
    ...recipe.ingredients,
  ]
    .join(" ")
    .toLowerCase();

  for (const entry of IMAGE_KEYWORDS) {
    if (entry.keywords.some((keyword) => haystack.includes(keyword))) {
      return entry.image;
    }
  }

  const cuisine = recipe.cuisine.toLowerCase();
  if (cuisine.includes("italian")) return IMAGE_LIBRARY.pasta;
  if (cuisine.includes("asian")) return IMAGE_LIBRARY.stirFry;
  if (cuisine.includes("mediterranean")) return IMAGE_LIBRARY.salad;
  if (recipe.mealTime.toLowerCase() === "breakfast") return IMAGE_LIBRARY.breakfast;
  return FALLBACK_IMAGE;
}

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
      'Schema: {"recipes":[{"name":string,"cuisine":string,"skillLevel":string,"cookTime":string,"budget":string,"mealTime":string,"ingredients":[string],"instructions":[string]}]}',
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
      "- Do not include image URLs; the server assigns images.",
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
      image: resolveRecipeImage(r),
      matchPercentage: computeMatchPercentage(ingredients, r.ingredients),
    }));

    return NextResponse.json({ recipes });
  } catch (e) {
    const rawMessage = e instanceof Error ? e.message : "Recipe generation failed";
    const mapped = mapRecipeApiError(rawMessage);
    return NextResponse.json({ error: mapped.clientMessage }, { status: mapped.status });
  }
}

