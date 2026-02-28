import { useRef } from "react";
import { X, Download, Clock, ChefHat, Users } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import html2canvas from "html2canvas";

export interface RecipeDetail {
  name: string;
  cookingTime: string;
  difficulty: string;
  imageUrl: string;
  servings: number;
  description: string;
  ingredients: string[];
  instructions: string[];
  tips?: string;
}

interface RecipeDetailModalProps {
  recipe: RecipeDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailModal({ recipe, isOpen, onClose }: RecipeDetailModalProps) {
  const recipeCardRef = useRef<HTMLDivElement>(null);

  if (!recipe) return null;

  const handleDownload = async () => {
    if (!recipeCardRef.current) return;

    try {
      const canvas = await html2canvas(recipeCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${recipe.name.replace(/\s+/g, '-').toLowerCase()}-recipe.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading recipe:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-2xl">{recipe.name}</h2>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={recipeCardRef} className="bg-white p-8">
          {/* Recipe Card Content */}
          <div className="space-y-8">
            {/* Header with Image */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-3xl mb-4">{recipe.name}</h1>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {recipe.description}
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm text-gray-600">Time</span>
                    <span className="text-sm">{recipe.cookingTime}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <ChefHat className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm text-gray-600">Difficulty</span>
                    <span className="text-sm">{recipe.difficulty}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm text-gray-600">Servings</span>
                    <span className="text-sm">{recipe.servings}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div>
              <h3 className="text-2xl mb-4 pb-2 border-b-2 border-gray-900">
                Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-3">•</span>
                    <span className="text-gray-800">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Section */}
            <div>
              <h3 className="text-2xl mb-4 pb-2 border-b-2 border-gray-900">
                Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4 mt-1">
                      {index + 1}
                    </span>
                    <p className="text-gray-800 leading-relaxed pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips Section */}
            {recipe.tips && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h3 className="text-xl mb-2 text-yellow-900">
                  💡 Pro Tips
                </h3>
                <p className="text-gray-800 leading-relaxed">{recipe.tips}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
