"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { IngredientChip } from "@/components/ingredient-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReviewPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedImage = sessionStorage.getItem("uploadedImage");
    if (!storedImage) {
      router.replace("/");
      return;
    }
    setImageUrl(storedImage);

    const storedIngredients = sessionStorage.getItem("detectedIngredients");
    if (storedIngredients) {
      try {
        const parsed = JSON.parse(storedIngredients);
        setIngredients(Array.isArray(parsed) ? parsed : []);
      } catch {
        setIngredients([]);
      }
    } else {
      setIngredients([
        "Tomatoes",
        "Eggs",
        "Cheese",
        "Lettuce",
        "Onions",
        "Bell peppers",
        "Chicken breast",
        "Garlic",
      ]);
    }
  }, [router]);

  const handleRemove = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, newValue: string) => {
    const updated = [...ingredients];
    updated[index] = newValue;
    setIngredients(updated);
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
      setShowAddInput(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    } else if (e.key === "Escape") {
      setNewIngredient("");
      setShowAddInput(false);
    }
  };

  const handleGenerateRecipes = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ingredients", JSON.stringify(ingredients));
    }
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-3 text-gray-900">
            Review detected ingredients
          </h1>
          <p className="text-lg text-gray-600">
            Review and edit detected ingredients before generating recipes.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="sticky top-8">
              <h2 className="text-xl mb-4 text-gray-700">Uploaded image</h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Uploaded food"
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-700">
                Detected ingredients ({ingredients.length})
              </h2>
              {!showAddInput && (
                <Button
                  onClick={() => setShowAddInput(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add ingredient
                </Button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              {ingredients.length === 0 ? (
                <p className="text-gray-500 text-sm mb-4">
                  No items detected in the image. Add ingredients manually below.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3 mb-4">
                {ingredients.map((ingredient, index) => (
                  <IngredientChip
                    key={index}
                    ingredient={ingredient}
                    onRemove={() => handleRemove(index)}
                    onEdit={(newValue) => handleEdit(index, newValue)}
                  />
                ))}
              </div>

              {showAddInput && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Input
                    type="text"
                    placeholder="Enter ingredient name"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button onClick={handleAddIngredient}>Add</Button>
                  <Button
                    onClick={() => {
                      setShowAddInput(false);
                      setNewIngredient("");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateRecipes}
                size="lg"
                className="px-12"
              >
                Generate recipes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
