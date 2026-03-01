import { useState, type KeyboardEvent } from 'react';
import { Plus, X, Sparkles, AlertTriangle, MapPin } from 'lucide-react';
import { DetectedIngredient } from './ImageUpload';

interface IngredientsListProps {
  ingredients: DetectedIngredient[];
  onAddIngredient: (ingredient: DetectedIngredient) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

const CATEGORY_LABELS = {
  produce: 'Produce',
  proteins: 'Proteins',
  dairy: 'Dairy',
  grains: 'Grains',
  condiments: 'Condiments',
  other: 'Other',
};

export function IngredientsList({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
}: IngredientsListProps) {
  const [newIngredient, setNewIngredient] = useState('');
  const [newCategory, setNewCategory] = useState<DetectedIngredient['category']>('other');

  const handleAdd = () => {
    if (newIngredient.trim()) {
      onAddIngredient({
        name: newIngredient.trim(),
        category: newCategory,
        useSoon: false,
      });
      setNewIngredient('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  // Group ingredients by category
  const categorizedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) {
      acc[ing.category] = [];
    }
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, DetectedIngredient[]>);

  // Get ingredients that need to be used soon
  const useSoonIngredients = ingredients.filter(ing => ing.useSoon);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-slate-600" />
        <h2 className="font-semibold text-slate-800">
          Your Fridge
        </h2>
      </div>

      {/* Summary */}
      <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <p className="text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-800">{ingredients.length} items</span> detected
          {categorizedIngredients.produce && ` • ${categorizedIngredients.produce.length} produce`}
          {categorizedIngredients.dairy && ` • ${categorizedIngredients.dairy.length} dairy`}
          {categorizedIngredients.proteins && ` • ${categorizedIngredients.proteins.length} proteins`}
        </p>
      </div>

      {/* Use Soon Warning */}
      {useSoonIngredients.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-orange-900 mb-1">Use Soon</p>
              <p className="text-xs text-orange-700">
                {useSoonIngredients.map(i => i.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* By Category */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-700 mb-2.5">By Category</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(categorizedIngredients).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1 tracking-wide">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {items.map(i =>
                  i.quantity != null && i.quantity > 1
                    ? `${i.name} (${i.quantity})`
                    : i.name
                ).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Ingredients Title */}
      <div className="border-t border-slate-200 pt-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-semibold text-slate-700">
              All Items
            </h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {ingredients.length}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Remove false positives or add missing items:
        </p>
      </div>

      {/* Ingredients Tags */}
      <div className="flex flex-wrap gap-2 mb-4 max-h-64 overflow-y-auto">
        {ingredients.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4 w-full">
            No ingredients detected yet
          </p>
        ) : (
          ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full group hover:bg-slate-100 transition-colors"
            >
              <span className="text-xs text-slate-700 capitalize">
                {ingredient.name}
                {ingredient.quantity != null && ingredient.quantity > 1 && (
                  <span className="text-slate-500"> ({ingredient.quantity})</span>
                )}
              </span>
              <button
                onClick={() => onRemoveIngredient(ingredient.name)}
                className="text-slate-400 hover:text-red-600 transition-colors"
                aria-label="Remove ingredient"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Ingredient */}
      <div className="border-t border-slate-200 pt-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add missing item..."
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <button
              onClick={handleAdd}
              disabled={!newIngredient.trim()}
              className="bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add ingredient"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as DetectedIngredient['category'])}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
          >
            <option value="produce">Produce</option>
            <option value="proteins">Proteins</option>
            <option value="dairy">Dairy</option>
            <option value="grains">Grains</option>
            <option value="condiments">Condiments</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}