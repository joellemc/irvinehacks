import { X, Pencil } from "lucide-react";
import { useState } from "react";

interface IngredientChipProps {
  ingredient: string;
  onRemove: () => void;
  onEdit: (newValue: string) => void;
}

export function IngredientChip({ ingredient, onRemove, onEdit }: IngredientChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(ingredient);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(editValue.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(ingredient);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full border-2 border-blue-500">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none w-24 text-sm"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
      <span className="text-sm text-gray-800">{ingredient}</span>
      <button
        onClick={handleEdit}
        className="p-1 hover:bg-gray-300 rounded-full transition-colors"
        aria-label="Edit ingredient"
      >
        <Pencil className="w-3 h-3 text-gray-600" />
      </button>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-gray-300 rounded-full transition-colors"
        aria-label="Remove ingredient"
      >
        <X className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  );
}
