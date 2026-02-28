import type { RecipeFilters as RecipeFiltersType } from './types';
import { SlidersHorizontal } from 'lucide-react';

interface RecipeFiltersProps {
  filters: RecipeFiltersType;
  onFiltersChange: (filters: RecipeFiltersType) => void;
}

export function RecipeFilters({ filters, onFiltersChange }: RecipeFiltersProps) {
  const handleFilterChange = (key: keyof RecipeFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-semibold text-slate-800">Recipe Preferences</h2>
      </div>

      <div className="space-y-4">
        {/* Cuisine */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Cuisine Type
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
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

        {/* Skill Level */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Skill Level
          </label>
          <select
            value={filters.skillLevel}
            onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="any">Any Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Cook Time */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Time to Cook
          </label>
          <select
            value={filters.cookTime}
            onChange={(e) => handleFilterChange('cookTime', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="any">Any Time</option>
            <option value="quick">Under 15 mins</option>
            <option value="moderate">15-30 mins</option>
            <option value="extended">30-60 mins</option>
            <option value="lengthy">Over 60 mins</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Budget
          </label>
          <select
            value={filters.budget}
            onChange={(e) => handleFilterChange('budget', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="any">Any Budget</option>
            <option value="low">Budget Friendly ($)</option>
            <option value="moderate">Moderate ($$)</option>
            <option value="high">Premium ($$$)</option>
          </select>
        </div>

        {/* Meal Time */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Meal Time
          </label>
          <select
            value={filters.mealTime}
            onChange={(e) => handleFilterChange('mealTime', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
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
  );
}
