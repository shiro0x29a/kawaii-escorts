import { useState } from 'react';

interface UseEditModeReturn {
  editingField: string | null;
  editValue: string;
  startEditing: (field: string, value: string | number | boolean | undefined) => void;
  setEditValue: (value: string) => void;
  cancelEditing: () => void;
}

export function useEditMode(): UseEditModeReturn {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEditing = (field: string, value: string | number | boolean | undefined) => {
    setEditingField(field);
    setEditValue(value?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  return {
    editingField,
    editValue,
    startEditing,
    setEditValue,
    cancelEditing,
  };
}
