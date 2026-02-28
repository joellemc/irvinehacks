import { Recipe } from './RecipeCard';
import { X, Clock, ChefHat, DollarSign, Check, Plus } from 'lucide-react';
import { useGrocery } from '../context/GroceryContext';

interface RecipeModalProps {
  recipe: Recipe;
  userIngredients: string[];
  onClose: () => void;
}

export function RecipeModal({ recipe, userIngredients, onClose }: RecipeModalProps) {
  const { addToGroceries, isInGroceries } = useGrocery();

  const ingredientsYouHave = recipe.ingredients.filter(ing =>
    userIngredients.some(userIng => 
      userIng.toLowerCase().includes(ing.toLowerCase()) || 
      ing.toLowerCase().includes(userIng.toLowerCase())
    )
  );

  const ingredientsYouNeed = recipe.ingredients.filter(ing =>
    !userIngredients.some(userIng => 
      userIng.toLowerCase().includes(ing.toLowerCase()) || 
      ing.toLowerCase().includes(userIng.toLowerCase())
    )
  );

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getBudgetIcons = (budget: string) => {
    switch (budget) {
      case 'low':
        return '$';
      case 'moderate':
        return '$$';
      case 'high':
        return '$$$';
      default:
        return '$';
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToGroceries = (ingredient: string) => {
    addToGroceries(ingredient);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between rounded-t-2xl">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">{recipe.name}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <ChefHat className="w-4 h-4" />
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getSkillColor(recipe.skillLevel)}`}>
                  {recipe.skillLevel}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">{getBudgetIcons(recipe.budget)}</span>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                {recipe.cuisine}
              </span>
              <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full capitalize">
                {recipe.mealTime}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ingredients You Have */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              Ingredients You Have ({ingredientsYouHave.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {ingredientsYouHave.map((ingredient, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium capitalize flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {ingredient}
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients You Need */}
          {ingredientsYouNeed.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-orange-600" />
                </div>
                Ingredients You Need ({ingredientsYouNeed.length})
              </h3>
              <div className="space-y-2">
                {ingredientsYouNeed.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <span className="text-sm font-medium text-orange-900 capitalize">
                      {ingredient}
                    </span>
                    <button
                      onClick={() => handleAddToGroceries(ingredient)}
                      disabled={isInGroceries(ingredient)}
                      className={`
                        text-xs px-3 py-1 rounded-md font-medium transition-all
                        ${isInGroceries(ingredient)
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                        }
                      `}
                    >
                      {isInGroceries(ingredient) ? '✓ Added' : '+ Add to Groceries'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">Step-by-Step Instructions</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
