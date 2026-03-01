import { useState, useRef } from 'react';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { detectIngredients } from '@/lib/detect';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, ingredients: string[], quantities?: Record<string, number>) => void;
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
    const safetyTimeout = setTimeout(() => {
      setIsProcessing(false);
      setError('Request took too long. You can try again or add ingredients manually.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 14_000);
    try {
      const { ingredients, quantities } = await detectIngredients(file);
      clearTimeout(safetyTimeout);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = (e.target?.result as string) ?? '';
        onImageUpload(imageUrl, ingredients, quantities);
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (err) {
      clearTimeout(safetyTimeout);
      const message = err instanceof Error ? err.message : 'Detection failed';
      setError(message);
      setIsProcessing(false);
      onImageUpload(URL.createObjectURL(file), [], {});
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsProcessing(false);
      clearTimeout(safetyTimeout);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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

      <label
        htmlFor="fridge-image-upload-src"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative block border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-celadon-500 bg-celadon-50' 
            : 'border-slate-200 hover:border-celadon-400 hover:bg-celadon-50/50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          id="fridge-image-upload-src"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload fridge photo"
        />

        {isProcessing ? (
          <div className="space-y-3">
            <Loader2 className="w-12 h-12 text-celadon-600 mx-auto animate-spin" />
            <p className="text-sm font-medium text-slate-700">Analyzing ingredients...</p>
            <p className="text-xs text-slate-500">Our AI is scanning your fridge</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-celadon-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-celadon-600" />
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
      </label>

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