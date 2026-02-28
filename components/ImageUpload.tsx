import { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';

export interface DetectedIngredient {
  name: string;
  category: 'produce' | 'proteins' | 'dairy' | 'grains' | 'condiments' | 'other';
  useSoon?: boolean;
}

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, ingredients: DetectedIngredient[]) => void;
}

// Mock AI detection - simulates ingredient detection from image with categories
const detectIngredientsFromImage = (): DetectedIngredient[] => {
  const possibleIngredients: DetectedIngredient[] = [
    // Produce
    { name: 'white onions', category: 'produce' },
    { name: 'avocado', category: 'produce', useSoon: true },
    { name: 'carrots', category: 'produce' },
    { name: 'cauliflower', category: 'produce' },
    { name: 'salad greens', category: 'produce', useSoon: true },
    { name: 'spinach', category: 'produce', useSoon: true },
    { name: 'tomatoes', category: 'produce' },
    { name: 'bell peppers', category: 'produce' },
    { name: 'broccoli', category: 'produce' },
    
    // Proteins
    { name: 'eggs', category: 'proteins' },
    { name: 'protein bars', category: 'proteins' },
    { name: 'almond butter', category: 'proteins' },
    { name: 'peanut butter', category: 'proteins' },
    { name: 'chicken breast', category: 'proteins' },
    
    // Dairy
    { name: 'kefir', category: 'dairy' },
    { name: 'Greek yogurt', category: 'dairy' },
    { name: 'raspberry kefir', category: 'dairy' },
    { name: 'vanilla coffee creamer', category: 'dairy' },
    { name: 'almond milk', category: 'dairy' },
    { name: 'Starbucks vanilla latte', category: 'dairy' },
    { name: 'shredded cheese', category: 'dairy' },
    { name: 'cheese slices', category: 'dairy' },
    { name: 'butter', category: 'dairy' },
    { name: 'milk', category: 'dairy' },
    
    // Grains
    { name: 'chickpea pasta', category: 'grains' },
    { name: 'tortillas', category: 'grains' },
    { name: 'rice', category: 'grains' },
    { name: 'bread', category: 'grains' },
    
    // Condiments
    { name: 'marinara sauce', category: 'condiments' },
    { name: 'salsa', category: 'condiments' },
    { name: 'soy sauce', category: 'condiments' },
    { name: 'olive oil', category: 'condiments' },
    
    // Other
    { name: 'chocolate bars', category: 'other' },
    { name: 'applesauce pouches', category: 'other' },
    { name: 'corn', category: 'other' },
    { name: 'green juice', category: 'other' },
    { name: 'sparkling water', category: 'other' },
  ];

  // Randomly select 15-28 ingredients to simulate detection
  const numIngredients = Math.floor(Math.random() * 14) + 15;
  const shuffled = [...possibleIngredients].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numIngredients);
};

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      // Simulate AI processing delay
      setTimeout(() => {
        const ingredients = detectIngredientsFromImage();
        onImageUpload(imageUrl, ingredients);
        setIsProcessing(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
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

      <p className="text-xs text-slate-500 mt-4 text-center">
        💡 Tip: Take a clear, well-lit photo of your fridge for best results
      </p>
    </div>
  );
}
