import { useState } from 'react';
import {
  ImageUpload,
  type DetectedIngredient,
} from '@/components/ImageUpload';
import { IngredientsList } from '@/components/IngredientsList';
import { RecipeList } from '../components/RecipeList';
import { Navbar } from '../components/Navbar';
import { SlidersHorizontal } from 'lucide-react';
import { RecipeFilters as RecipeFiltersType } from '../App';

const DEFAULT_ASSUMPTIONS: DetectedIngredient[] = [
  { name: 'water', category: 'other', useSoon: false },
  { name: 'salt', category: 'condiments', useSoon: false },
  { name: 'pepper', category: 'condiments', useSoon: false },
  { name: 'oil', category: 'condiments', useSoon: false },
];

function normalizeIngredientName(name: string): string {
  return name.toLowerCase().trim().replace(/_/g, ' ');
}

export function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<DetectedIngredient[]>([]);
  const [assumptions, setAssumptions] = useState<DetectedIngredient[]>(() =>
    DEFAULT_ASSUMPTIONS.map((ingredient) => ({ ...ingredient })),
  );
  const [filters, setFilters] = useState<RecipeFiltersType>({
    cuisine: 'any',
    skillLevel: 'any',
    cookTime: 'any',
    budget: 'any',
    mealTime: 'any',
  });
  const [showRecipes, setShowRecipes] = useState(false);

  const handleImageUpload = (
    imageUrl: string,
    detectedIngredients: DetectedIngredient[],
  ) => {
    setUploadedImage(imageUrl);
    setIngredients(detectedIngredients);
    setShowRecipes(true);
  };

  const handleAddIngredient = (ingredient: DetectedIngredient) => {
    const normalizedName = normalizeIngredientName(ingredient.name);
    if (!normalizedName) return;

    setIngredients((prevIngredients) => {
      const alreadyExists = prevIngredients.some(
        (item) => normalizeIngredientName(item.name) === normalizedName,
      );
      if (alreadyExists) return prevIngredients;
      return [...prevIngredients, { ...ingredient, name: normalizedName }];
    });
  };

  const handleRemoveIngredient = (ingredientName: string) => {
    const normalizedName = normalizeIngredientName(ingredientName);
    setIngredients((prevIngredients) =>
      prevIngredients.filter(
        (ingredient) => normalizeIngredientName(ingredient.name) !== normalizedName,
      ),
    );
  };

  const handleAddAssumption = (ingredient: DetectedIngredient) => {
    const normalizedName = normalizeIngredientName(ingredient.name);
    if (!normalizedName) return;

    setAssumptions((prevAssumptions) => {
      const alreadyExists = prevAssumptions.some(
        (item) => normalizeIngredientName(item.name) === normalizedName,
      );
      if (alreadyExists) return prevAssumptions;
      return [
        ...prevAssumptions,
        { ...ingredient, name: normalizedName, useSoon: false },
      ];
    });
  };

  const handleRemoveAssumption = (ingredientName: string) => {
    const normalizedName = normalizeIngredientName(ingredientName);
    setAssumptions((prevAssumptions) =>
      prevAssumptions.filter(
        (ingredient) => normalizeIngredientName(ingredient.name) !== normalizedName,
      ),
    );
  };

  // Include assumptions for recipe matching and dedupe by normalized name.
  const ingredientNames = Array.from(
    new Set(
      [...ingredients, ...assumptions]
        .map((ingredient) => normalizeIngredientName(ingredient.name))
        .filter(Boolean),
    ),
  );

  return (
    <div className="min-h-screen bg-teal-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!showRecipes ? (
          <div className="bg-white rounded-2xl shadow-sm border border-teal-200 p-8">
            {/* Upload Section */}
            <div className="mb-8">
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>

            {/* Preferences Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-celadon-600" />
                <h3 className="text-lg font-semibold text-slate-800">Set Your Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Cuisine Type
                  </label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                  >
                    <option value="any">Any Cuisine</option>
                    <option value="american">American</option>
                    <option value="asian">Asian</option>
                    <option value="british">British</option>
                    <option value="french">French</option>
                    <option value="indian">Indian</option>
                    <option value="italian">Italian</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="mexican">Mexican</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Skill Level
                  </label>
                  <select
                    value={filters.skillLevel}
                    onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                  >
                    <option value="any">Any Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Time to Cook
                  </label>
                  <select
                    value={filters.cookTime}
                    onChange={(e) => setFilters({ ...filters, cookTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                  >
                    <option value="any">Any Time</option>
                    <option value="quick">Under 15 mins</option>
                    <option value="moderate">15-30 mins</option>
                    <option value="extended">30-60 mins</option>
                    <option value="lengthy">Over 60 mins</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Budget
                  </label>
                  <select
                    value={filters.budget}
                    onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                  >
                    <option value="any">Any Budget</option>
                    <option value="low">Budget Friendly ($)</option>
                    <option value="moderate">Moderate ($$)</option>
                    <option value="high">Premium ($$$)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Meal Time
                  </label>
                  <select
                    value={filters.mealTime}
                    onChange={(e) => setFilters({ ...filters, mealTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                  >
                    <option value="any">Any Time</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar - Ingredients */}
            <div className="lg:col-span-1">
              <IngredientsList
                ingredients={ingredients}
                assumptions={assumptions}
                onAddIngredient={handleAddIngredient}
                onRemoveIngredient={handleRemoveIngredient}
                onAddAssumption={handleAddAssumption}
                onRemoveAssumption={handleRemoveAssumption}
              />
            </div>
            
            {/* Right content - Filters and Recipes */}
            <div className="lg:col-span-3">
              {/* Compact Filters Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-teal-200 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                  <h3 className="font-medium text-slate-800">Filters</h3>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                      Cuisine
                    </label>
                    <select
                      value={filters.cuisine}
                      onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                    >
                      <option value="any">Any</option>
                      <option value="american">American</option>
                      <option value="asian">Asian</option>
                      <option value="british">British</option>
                      <option value="french">French</option>
                      <option value="indian">Indian</option>
                      <option value="italian">Italian</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="mexican">Mexican</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                      Skill Level
                    </label>
                    <select
                      value={filters.skillLevel}
                      onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                    >
                      <option value="any">Any</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                      Cook Time
                    </label>
                    <select
                      value={filters.cookTime}
                      onChange={(e) => setFilters({ ...filters, cookTime: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                    >
                      <option value="any">Any</option>
                      <option value="quick">&lt;15 min</option>
                      <option value="moderate">15-30 min</option>
                      <option value="extended">30-60 min</option>
                      <option value="lengthy">&gt;60 min</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                      Budget
                    </label>
                    <select
                      value={filters.budget}
                      onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                    >
                      <option value="any">Any</option>
                      <option value="low">$</option>
                      <option value="moderate">$$</option>
                      <option value="high">$$$</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                      Meal Type
                    </label>
                    <select
                      value={filters.mealTime}
                      onChange={(e) => setFilters({ ...filters, mealTime: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:border-transparent bg-white"
                    >
                      <option value="any">Any</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recipes */}
              <RecipeList ingredients={ingredientNames} filters={filters} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}