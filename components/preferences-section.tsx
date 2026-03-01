"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Preferences {
  cuisine: string;
  cookingTime: string;
  skillLevel: string;
  budget: string;
}

interface PreferencesSectionProps {
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}

export function PreferencesSection({
  preferences,
  onPreferencesChange,
}: PreferencesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof Preferences, value: string) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <div className="border border-teal-200 rounded-xl bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
      >
        <span className="text-lg text-gray-700">
          Preferences (optional)
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Cuisine type
            </label>
            <Select
              value={preferences.cuisine}
              onValueChange={(value) => handleChange("cuisine", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="Asian">Asian</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Cooking time
            </label>
            <Select
              value={preferences.cookingTime}
              onValueChange={(value) => handleChange("cookingTime", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="15 min">15 min</SelectItem>
                <SelectItem value="30 min">30 min</SelectItem>
                <SelectItem value="1 hour">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Skill level
            </label>
            <Select
              value={preferences.skillLevel}
              onValueChange={(value) => handleChange("skillLevel", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Budget</label>
            <Select
              value={preferences.budget}
              onValueChange={(value) => handleChange("budget", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any">Any</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
