import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

interface IngredientsListProps {
  ingredients: string[];
  quantities?: Record<string, number>;
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

function normalizeKey(name: string): string {
  return name.toLowerCase().trim().replace(/_/g, ' ');
}

export function IngredientsList({
  ingredients,
  quantities = {},
  onAddIngredient,
  onRemoveIngredient,
}: IngredientsListProps) {
  const [newIngredient, setNewIngredient] = useState('');

  const handleAdd = () => {
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-teal-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-celadon-600" />
        <h2 className="text-lg font-semibold text-slate-800">
          Detected Ingredients
        </h2>
        <span className="bg-celadon-100 text-celadon-700 text-xs font-medium px-2 py-1 rounded-full">
          {ingredients.length}
        </span>
      </div>

      {/* Ingredients List */}
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {ingredients.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No ingredients detected yet
          </p>
        ) : (
          ingredients.map((ingredient, index) => {
            const key = normalizeKey(ingredient);
            const count = quantities[key];
            const displayLabel = count != null && count > 1 ? `${ingredient} (${count})` : ingredient;
            return (
            <div
              key={`${ingredient}-${index}`}
              className="flex items-center justify-between bg-celadon-100 px-3 py-2 rounded-lg group"
            >
              <span className="text-sm font-medium text-slate-700 capitalize">
                {displayLabel}
              </span>
              <button
                onClick={() => onRemoveIngredient(ingredient)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                aria-label="Remove ingredient"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );})
        )}
      </div>

      {/* Add Ingredient */}
      <div className="border-t border-slate-100 pt-4">
        <label className="text-sm font-medium text-slate-700 mb-2 block">
          Add Missing Ingredient
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., avocado, bacon..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent"
          />
          <button
            onClick={handleAdd}
            disabled={!newIngredient.trim()}
            className="bg-celadon-600 text-white p-2 rounded-lg hover:bg-celadon-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add ingredient"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
