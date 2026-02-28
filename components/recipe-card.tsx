"use client";

import { Clock, ChefHat, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  name: string;
  cookingTime: string;
  difficulty: string;
  imageUrl: string;
  allIngredientsAvailable?: boolean;
  missingIngredients?: string[];
  onClick?: () => void;
}

export function RecipeCard({
  name,
  cookingTime,
  difficulty,
  imageUrl,
  allIngredientsAvailable = false,
  missingIngredients = [],
  onClick,
}: RecipeCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        {allIngredientsAvailable && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              All ingredients available
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl mb-3">{name}</h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{cookingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{difficulty}</span>
          </div>
        </div>

        {missingIngredients.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Just missing:{" "}
              <span className="text-gray-900">
                {missingIngredients.join(", ")}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
