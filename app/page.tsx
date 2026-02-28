"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCard } from "@/components/upload-card";
import {
  PreferencesSection,
  Preferences,
} from "@/components/preferences-section";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
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
      const imageUrl = URL.createObjectURL(uploadedImage);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("uploadedImage", imageUrl);
        sessionStorage.setItem("preferences", JSON.stringify(preferences));
      }
      router.push("/review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-gray-900">
            What&apos;s in your fridge?
          </h1>
          <p className="text-xl text-gray-600">
            Upload a photo and we&apos;ll suggest recipes using what you
            already have.
          </p>
        </div>

        <div className="mb-8">
          <UploadCard onImageUpload={handleImageUpload} />
        </div>

        {uploadedImage && (
          <div className="mb-8 text-center">
            <p className="text-sm text-green-600 mb-2">
              ✓ Image uploaded successfully
            </p>
            <p className="text-xs text-gray-500">{uploadedImage.name}</p>
          </div>
        )}

        <div className="mb-10">
          <PreferencesSection
            preferences={preferences}
            onPreferencesChange={setPreferences}
          />
        </div>

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
