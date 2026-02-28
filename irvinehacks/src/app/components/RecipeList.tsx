import { useMemo, useState } from 'react';
import { RecipeFilters } from '../App';
import { RecipeCard, Recipe } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { Sparkles } from 'lucide-react';

interface RecipeListProps {
  ingredients: string[];
  filters: RecipeFilters;
}

// Mock recipe database
const ALL_RECIPES: Recipe[] = [
  {
    id: 1,
    name: 'Classic Chicken Stir-Fry',
    cuisine: 'asian',
    skillLevel: 'beginner',
    cookTime: '20 mins',
    budget: 'low',
    mealTime: 'dinner',
    ingredients: ['chicken breast', 'bell peppers', 'onions', 'soy sauce', 'garlic', 'rice'],
    instructions: [
      'Cut chicken into bite-sized pieces and season with salt and pepper',
      'Heat oil in a wok or large pan over high heat',
      'Stir-fry chicken until golden brown, about 5 minutes',
      'Add vegetables and garlic, stir-fry for 3 minutes',
      'Add soy sauce and toss everything together',
      'Serve hot over steamed rice',
    ],
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 2,
    name: 'Creamy Mushroom Pasta',
    cuisine: 'italian',
    skillLevel: 'beginner',
    cookTime: '25 mins',
    budget: 'low',
    mealTime: 'dinner',
    ingredients: ['pasta', 'mushrooms', 'garlic', 'butter', 'cheese', 'milk'],
    instructions: [
      'Cook pasta according to package directions',
      'Sauté sliced mushrooms and garlic in butter until golden',
      'Add milk and cheese, stirring until creamy',
      'Toss cooked pasta with the mushroom sauce',
      'Season with salt, pepper, and fresh herbs',
      'Serve immediately with extra cheese on top',
    ],
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 3,
    name: 'Veggie Omelet',
    cuisine: 'american',
    skillLevel: 'beginner',
    cookTime: '10 mins',
    budget: 'low',
    mealTime: 'breakfast',
    ingredients: ['eggs', 'bell peppers', 'onions', 'mushrooms', 'cheese', 'butter'],
    instructions: [
      'Beat eggs in a bowl with salt and pepper',
      'Sauté diced vegetables in butter until soft',
      'Pour eggs over vegetables in the pan',
      'Cook until edges set, then sprinkle with cheese',
      'Fold omelet in half and cook until cheese melts',
      'Slide onto plate and serve hot',
    ],
    image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 4,
    name: 'Garlic Butter Chicken',
    cuisine: 'american',
    skillLevel: 'intermediate',
    cookTime: '30 mins',
    budget: 'moderate',
    mealTime: 'dinner',
    ingredients: ['chicken breast', 'garlic', 'butter', 'olive oil', 'spinach', 'cheese'],
    instructions: [
      'Season chicken with salt, pepper, and herbs',
      'Pan-sear chicken in olive oil until golden on both sides',
      'Remove chicken and add butter and minced garlic to pan',
      'Add spinach and cook until wilted',
      'Return chicken to pan, top with cheese',
      'Cover and cook until chicken is done and cheese melts',
    ],
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 5,
    name: 'Fried Rice Special',
    cuisine: 'asian',
    skillLevel: 'beginner',
    cookTime: '15 mins',
    budget: 'low',
    mealTime: 'lunch',
    ingredients: ['rice', 'eggs', 'carrots', 'onions', 'soy sauce', 'garlic'],
    instructions: [
      'Heat oil in a wok over high heat',
      'Scramble eggs and set aside',
      'Stir-fry diced vegetables until tender',
      'Add cold cooked rice and break up any clumps',
      'Add soy sauce and toss to coat evenly',
      'Mix in scrambled eggs and serve hot',
    ],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 6,
    name: 'Loaded Baked Potato',
    cuisine: 'american',
    skillLevel: 'beginner',
    cookTime: '60 mins',
    budget: 'low',
    mealTime: 'dinner',
    ingredients: ['potatoes', 'cheese', 'butter', 'milk', 'onions'],
    instructions: [
      'Scrub potatoes and prick with a fork',
      'Bake at 400°F for 50-60 minutes until tender',
      'Cut open and fluff insides with a fork',
      'Top with butter, cheese, and diced onions',
      'Return to oven until cheese melts',
      'Serve hot with additional toppings if desired',
    ],
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 7,
    name: 'Spinach and Cheese Quiche',
    cuisine: 'french',
    skillLevel: 'intermediate',
    cookTime: '45 mins',
    budget: 'moderate',
    mealTime: 'breakfast',
    ingredients: ['eggs', 'milk', 'cheese', 'spinach', 'onions'],
    instructions: [
      'Preheat oven to 375°F',
      'Sauté spinach and onions until wilted',
      'Whisk together eggs, milk, and cheese',
      'Add sautéed vegetables to egg mixture',
      'Pour into pie crust and bake for 35-40 minutes',
      'Let cool slightly before slicing',
    ],
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79cbd2?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 8,
    name: 'Grilled Cheese Deluxe',
    cuisine: 'american',
    skillLevel: 'beginner',
    cookTime: '10 mins',
    budget: 'low',
    mealTime: 'lunch',
    ingredients: ['bread', 'cheese', 'butter', 'tomatoes'],
    instructions: [
      'Butter one side of each bread slice',
      'Layer cheese and tomato slices between bread',
      'Heat pan over medium heat',
      'Grill sandwich until golden brown on both sides',
      'Press down gently while cooking for even browning',
      'Cut in half and serve hot',
    ],
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 9,
    name: 'Vegetable Stir-Fry',
    cuisine: 'asian',
    skillLevel: 'beginner',
    cookTime: '15 mins',
    budget: 'low',
    mealTime: 'dinner',
    ingredients: ['broccoli', 'carrots', 'bell peppers', 'mushrooms', 'garlic', 'soy sauce'],
    instructions: [
      'Cut all vegetables into uniform bite-sized pieces',
      'Heat oil in a wok over high heat',
      'Add garlic and stir-fry for 30 seconds',
      'Add harder vegetables first, then softer ones',
      'Toss with soy sauce and cook until tender-crisp',
      'Serve immediately over rice or noodles',
    ],
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 10,
    name: 'Tomato Basil Pasta',
    cuisine: 'italian',
    skillLevel: 'beginner',
    cookTime: '20 mins',
    budget: 'low',
    mealTime: 'dinner',
    ingredients: ['pasta', 'tomatoes', 'garlic', 'olive oil', 'cheese'],
    instructions: [
      'Cook pasta according to package directions',
      'Sauté minced garlic in olive oil until fragrant',
      'Add diced tomatoes and simmer for 10 minutes',
      'Toss cooked pasta with tomato sauce',
      'Season with salt, pepper, and fresh basil',
      'Top with grated cheese and serve',
    ],
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 11,
    name: 'Breakfast Scramble',
    cuisine: 'american',
    skillLevel: 'beginner',
    cookTime: '12 mins',
    budget: 'low',
    mealTime: 'breakfast',
    ingredients: ['eggs', 'potatoes', 'onions', 'bell peppers', 'cheese'],
    instructions: [
      'Dice potatoes and cook in a pan until crispy',
      'Add diced onions and peppers, cook until soft',
      'Pour beaten eggs over vegetables',
      'Scramble everything together until eggs are cooked',
      'Sprinkle with cheese and let it melt',
      'Serve hot with toast',
    ],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
    matchPercentage: 0,
  },
  {
    id: 12,
    name: 'Garlic Roasted Vegetables',
    cuisine: 'mediterranean',
    skillLevel: 'beginner',
    cookTime: '35 mins',
    budget: 'low',
    mealTime: 'dinner',
    ingredients: ['carrots', 'potatoes', 'broccoli', 'garlic', 'olive oil'],
    instructions: [
      'Preheat oven to 425°F',
      'Cut vegetables into uniform pieces',
      'Toss with olive oil, minced garlic, salt, and pepper',
      'Spread on a baking sheet in a single layer',
      'Roast for 25-30 minutes until golden and tender',
      'Serve as a side dish or over grains',
    ],
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
    matchPercentage: 0,
  },
];

export function RecipeList({ ingredients = [], filters }: RecipeListProps) {
  const filteredRecipes = useMemo(() => {
    // Calculate match percentage for each recipe
    const recipesWithMatch = ALL_RECIPES.map((recipe) => {
      const matchingIngredients = recipe.ingredients.filter((ing) =>
        // guard against undefined or non-string entries coming from props
        ingredients.some((userIng) => {
          if (typeof userIng !== 'string') return false;
          const normalizedUser = userIng.toLowerCase();
          const normalizedIng = ing.toLowerCase();
          return (
            normalizedUser.includes(normalizedIng) ||
            normalizedIng.includes(normalizedUser)
          );
        })
        (matchingIngredients.length / recipe.ingredients.length) * 100
      );
      return { ...recipe, matchPercentage };
    });

    // Filter by user preferences
    let filtered = recipesWithMatch.filter((recipe) => {
      if (filters.cuisine !== 'any' && recipe.cuisine !== filters.cuisine) return false;
      if (filters.skillLevel !== 'any' && recipe.skillLevel !== filters.skillLevel) return false;
      if (filters.mealTime !== 'any' && recipe.mealTime !== filters.mealTime) return false;
      if (filters.budget !== 'any' && recipe.budget !== filters.budget) return false;
      
      if (filters.cookTime !== 'any') {
        const time = parseInt(recipe.cookTime);
        if (filters.cookTime === 'quick' && time >= 15) return false;
        if (filters.cookTime === 'moderate' && (time < 15 || time > 30)) return false;
        if (filters.cookTime === 'extended' && (time < 30 || time > 60)) return false;
        if (filters.cookTime === 'lengthy' && time <= 60) return false;
      }

      // Only show recipes with at least some matching ingredients
      return recipe.matchPercentage > 0;
    });

    // Sort by match percentage
    filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return filtered;
  }, [ingredients, filters]);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (filteredRecipes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Recipes Found</h3>
          <p className="text-slate-600 mb-4">
            We couldn't find any recipes matching your criteria. Try adjusting your filters or adding more ingredients.
          </p>
          <div className="bg-orange-50 p-4 rounded-xl text-left">
            <p className="text-sm font-semibold text-slate-800 mb-2">Suggestions:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Change your cuisine preference to "Any Cuisine"</li>
              <li>• Adjust your skill level or time requirements</li>
              <li>• Add more ingredients from your fridge</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Found {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''}
        </h2>
        <p className="text-slate-600">
          Based on your ingredients and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
        ))}
      </div>

      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          userIngredients={ingredients}
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}