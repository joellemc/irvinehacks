"use client";

import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface UploadCardProps {
  onImageUpload: (file: File) => void;
}

export function UploadCard({ onImageUpload }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-16 text-center transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <Upload className="w-10 h-10 text-blue-600" />
        </div>

        <div>
          <p className="text-xl text-gray-700 mb-2">
            Drag and drop your image here
          </p>
          <p className="text-sm text-gray-500">
            or click the button below to browse
          </p>
        </div>

        <Button onClick={handleButtonClick} size="lg">
          Upload photo
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
