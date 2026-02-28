"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import {
  RecipeDetailModal,
} from "@/components/recipe-detail-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { recipesData, type RecipeDetail } from "@/lib/recipes";

interface Recipe {
  name: string;
  cookingTime: string;
  difficulty: string;
  imageUrl: string;
  allIngredientsAvailable: boolean;
  missingIngredients: string[];
  recipeKey: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedIngredients = sessionStorage.getItem("ingredients");
    if (!storedIngredients) {
      router.replace("/");
      return;
    }
    setIngredients(JSON.parse(storedIngredients));
  }, [router]);

  const handleRecipeClick = (recipeKey: string) => {
    setSelectedRecipe(recipesData[recipeKey] ?? null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const recipesWithAllIngredients: Recipe[] = [
    {
      name: "Classic Omelet with Vegetables",
      cookingTime: "15 min",
      difficulty: "Beginner",
      imageUrl:
        "https://images.unsplash.com/photo-1729223921247-c85b9b1a8ea8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBvbWVsZXQlMjB0b2FzdHxlbnwxfHx8fDE3NzIyNTQzMDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: true,
      missingIngredients: [],
      recipeKey: "classic-omelet",
    },
    {
      name: "Garden Fresh Salad Bowl",
      cookingTime: "10 min",
      difficulty: "Beginner",
      imageUrl:
        "https://images.unsplash.com/photo-1633618309834-665b69ca6bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzcyMjU0MzA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: true,
      missingIngredients: [],
      recipeKey: "garden-salad",
    },
    {
      name: "Stuffed Bell Peppers",
      cookingTime: "45 min",
      difficulty: "Intermediate",
      imageUrl:
        "https://images.unsplash.com/photo-1760445529098-949fcfc7c9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfGZyZXNoJTIwaW5ncmVkaWVudHMlMjBraXRjaGVuJTIwY291bnRlcnxlbnwxfHx8fDE3NzIxNzY1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: true,
      missingIngredients: [],
      recipeKey: "stuffed-peppers",
    },
  ];

  const recipesWithMissingIngredients: Recipe[] = [
    {
      name: "Chicken Stir Fry",
      cookingTime: "25 min",
      difficulty: "Intermediate",
      imageUrl:
        "https://images.unsplash.com/photo-1761314025701-34795be5f737?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwc3RpciUyMGZyeSUyMGFzaWFufGVufDF8fHx8MTc3MjEzMjQ5OHww&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: false,
      missingIngredients: ["soy sauce", "ginger"],
      recipeKey: "chicken-stir-fry",
    },
    {
      name: "Creamy Tomato Soup",
      cookingTime: "30 min",
      difficulty: "Beginner",
      imageUrl:
        "https://images.unsplash.com/photo-1553881781-4c55163dc5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBzb3VwJTIwYnJlYWR8ZW58MXx8fHwxNzcyMjU0MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: false,
      missingIngredients: ["heavy cream"],
      recipeKey: "tomato-soup",
    },
    {
      name: "Grilled Salmon with Vegetables",
      cookingTime: "35 min",
      difficulty: "Intermediate",
      imageUrl:
        "https://images.unsplash.com/photo-1633524792246-f25f5b0d66dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NzIyNDkxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: false,
      missingIngredients: ["salmon fillet", "lemon"],
      recipeKey: "grilled-salmon",
    },
    {
      name: "Pasta Carbonara",
      cookingTime: "20 min",
      difficulty: "Intermediate",
      imageUrl:
        "https://images.unsplash.com/photo-1627207644206-a2040d60ecad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYSUyMGRpc2h8ZW58MXx8fHwxNzcyMTg5ODk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      allIngredientsAvailable: false,
      missingIngredients: ["pasta", "bacon"],
      recipeKey: "pasta-carbonara",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-12">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Start over
            </Link>
          </Button>

          <h1 className="text-4xl mb-3 text-gray-900">
            Your recipe suggestions
          </h1>
          <p className="text-lg text-gray-600">
            Based on your available ingredients: {ingredients.join(", ")}
          </p>
        </div>

        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">
              You can make these now
            </h2>
            <p className="text-gray-600">
              All ingredients are available in your fridge
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {recipesWithAllIngredients.map((recipe, index) => (
              <RecipeCard
                key={index}
                {...recipe}
                onClick={() => handleRecipeClick(recipe.recipeKey)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 mb-2">
              If you buy 1–2 items
            </h2>
            <p className="text-gray-600">
              Reduce food waste by making the most of what you have
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {recipesWithMissingIngredients.map((recipe, index) => (
              <RecipeCard
                key={index}
                {...recipe}
                onClick={() => handleRecipeClick(recipe.recipeKey)}
              />
            ))}
          </div>
        </section>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-900">
            💡 <strong>Tip:</strong> These recipes are designed to help you
            reduce food waste by using ingredients you already have. Feel free to
            substitute similar ingredients based on what&apos;s available!
          </p>
        </div>
      </div>

      <RecipeDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipe={selectedRecipe}
      />
    </div>
  );
}
