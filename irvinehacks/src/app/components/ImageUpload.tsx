import { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, ingredients: string[]) => void;
}

// Mock AI detection - simulates ingredient detection from image
const detectIngredientsFromImage = (): string[] => {
  const possibleIngredients = [
    'chicken breast',
    'eggs',
    'milk',
    'cheese',
    'tomatoes',
    'lettuce',
    'onions',
    'garlic',
    'carrots',
    'potatoes',
    'bell peppers',
    'mushrooms',
    'spinach',
    'broccoli',
    'pasta',
    'rice',
    'bread',
    'butter',
    'olive oil',
    'soy sauce',
  ];

  // Randomly select 5-10 ingredients to simulate detection
  const numIngredients = Math.floor(Math.random() * 6) + 5;
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