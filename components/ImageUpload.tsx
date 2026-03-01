import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { detectIngredients } from '@/lib/detect';

export interface DetectedIngredient {
  name: string;
  category: 'produce' | 'proteins' | 'dairy' | 'grains' | 'condiments' | 'other';
  useSoon?: boolean;
}

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, ingredients: DetectedIngredient[]) => void;
}

const CATEGORY_KEYWORDS: Record<DetectedIngredient['category'], string[]> = {
  produce: [
    'avocado', 'lettuce', 'spinach', 'salad', 'onion', 'tomato', 'pepper', 'broccoli',
    'carrot', 'potato', 'mushroom', 'cauliflower', 'cucumber', 'zucchini', 'apple', 'fruit',
  ],
  proteins: ['egg', 'chicken', 'beef', 'pork', 'turkey', 'tofu', 'fish', 'salmon', 'tuna', 'bean'],
  dairy: ['milk', 'cheese', 'yogurt', 'kefir', 'cream', 'butter', 'latte'],
  grains: ['bread', 'rice', 'pasta', 'tortilla', 'noodle', 'oat', 'quinoa'],
  condiments: ['sauce', 'oil', 'vinegar', 'ketchup', 'mustard', 'mayo', 'salsa', 'soy'],
  other: [],
};

const USE_SOON_KEYWORDS = ['avocado', 'spinach', 'salad', 'lettuce', 'berry', 'kefir', 'milk', 'yogurt'];

function normalizeIngredientName(name: string): string {
  return name.toLowerCase().trim().replace(/_/g, ' ');
}

function classifyCategory(name: string): DetectedIngredient['category'] {
  const normalized = normalizeIngredientName(name);
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as Array<
    [DetectedIngredient['category'], string[]]
  >) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return 'other';
}

function shouldUseSoon(name: string): boolean {
  const normalized = normalizeIngredientName(name);
  return USE_SOON_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function toDetectedIngredients(ingredients: string[]): DetectedIngredient[] {
  const unique = Array.from(
    new Set(
      ingredients
        .map((ingredient) => normalizeIngredientName(ingredient))
        .filter(Boolean),
    ),
  );

  return unique.map((name) => ({
    name,
    category: classifyCategory(name),
    useSoon: shouldUseSoon(name),
  }));
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const { ingredients } = await detectIngredients(file);
      const detectedIngredients = toDetectedIngredients(ingredients);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = (e.target?.result as string) ?? '';
        onImageUpload(imageUrl, detectedIngredients);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Detection failed';
      setError(message);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = (e.target?.result as string) ?? '';
        onImageUpload(imageUrl, []);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Upload Your Fridge Photo</h3>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isProcessing ? (
          <div className="space-y-3">
            <Loader2 className="w-12 h-12 text-orange-500 mx-auto animate-spin" />
            <p className="text-sm font-medium text-slate-700">Analyzing ingredients...</p>
            <p className="text-xs text-slate-500">Our AI is scanning your fridge</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                Drop your image here or click to browse
              </p>
              <p className="text-xs text-slate-500">
                JPG, PNG, or JPEG up to 10MB
              </p>
            </div>
            <Upload className="w-5 h-5 text-slate-400 mx-auto" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-3 text-center" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-slate-500 mt-4 text-center">
        💡 Tip: Take a clear, well-lit photo of your fridge for best results
      </p>
    </div>
  );
}
