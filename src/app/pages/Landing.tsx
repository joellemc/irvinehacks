import { useState } from "react";
import { useNavigate } from "react-router";
import { UploadCard } from "../components/UploadCard";
import { PreferencesSection, Preferences } from "../components/PreferencesSection";
import { Button } from "../components/ui/button";

export function Landing() {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    cuisine: "Any",
    cookingTime: "Any",
    skillLevel: "Any",
    budget: "Any",
  });

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
  };

  const handleAnalyze = () => {
    if (uploadedImage) {
      // Store the image and preferences in session storage for the next page
      const imageUrl = URL.createObjectURL(uploadedImage);
      sessionStorage.setItem('uploadedImage', imageUrl);
      sessionStorage.setItem('preferences', JSON.stringify(preferences));
      navigate('/review');
    }
  };

  return (
    <div className="min-h-screen bg-teal-50">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-gray-900">
            What's in your fridge?
          </h1>
          <p className="text-xl text-gray-600">
            Upload a photo and we'll suggest recipes using what you already have.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <UploadCard onImageUpload={handleImageUpload} />
        </div>

        {uploadedImage && (
          <div className="mb-8 text-center">
            <p className="text-sm text-celadon-500 mb-2">✓ Image uploaded successfully</p>
            <p className="text-xs text-gray-500">{uploadedImage.name}</p>
          </div>
        )}

        {/* Preferences Section */}
        <div className="mb-10">
          <PreferencesSection 
            preferences={preferences} 
            onPreferencesChange={setPreferences} 
          />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleAnalyze} 
            disabled={!uploadedImage}
            size="lg"
            className="px-12 py-6 text-lg"
          >
            Analyze my food
          </Button>
        </div>

        {!uploadedImage && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Upload an image to continue
          </p>
        )}
      </div>
    </div>
  );
}
