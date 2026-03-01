import { Clock, DollarSign, ChefHat, Utensils } from 'lucide-react';

export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  skillLevel: string;
  cookTime: string;
  budget: string;
  mealTime: string;
  ingredients: string[];
  instructions: string[];
  image: string;
  matchPercentage: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const getSkillColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-celadon-100 text-celadon-700';
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

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-teal-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 bg-celadon-100 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        {/* Match Badge */}
        <div className="absolute top-3 right-3 bg-teal-100 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-sm font-bold text-celadon-600">
            {recipe.matchPercentage}% Match
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{recipe.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-2 py-1 bg-celadon-100 text-celadon-700 rounded-full">
              {recipe.cuisine}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getSkillColor(recipe.skillLevel)}`}>
              {recipe.skillLevel}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-celadon-100 text-celadon-700 rounded-full capitalize">
              {recipe.mealTime}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600">{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600">{getBudgetIcons(recipe.budget)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-600 capitalize">{recipe.skillLevel}</span>
          </div>
        </div>

        {/* Ingredients Preview */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-celadon-600" />
            Key Ingredients
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-md capitalize"
              >
                {ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 5 && (
              <span className="text-xs px-2 py-1 bg-slate-50 text-slate-600 rounded-md">
                +{recipe.ingredients.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Instructions Preview */}
        <div>
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Quick Steps</h4>
          <ol className="text-sm text-slate-600 space-y-1">
            {recipe.instructions.slice(0, 3).map((step, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-celadon-600 font-medium">{index + 1}.</span>
                <span className="line-clamp-2">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}