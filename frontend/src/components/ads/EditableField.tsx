'use client';

import { useState } from 'react';
import styles from './AdView.module.css';

interface City {
  id: number;
  nameRu: string;
  nameEn: string;
}

interface EditableFieldProps {
  field: string;
  label?: string;
  value: string | number | undefined;
  displayValue?: string;
  isOwner: boolean;
  editMode: {
    editingField: string | null;
    editValue: string;
    startEditing: (field: string, value: string | number | boolean | undefined) => void;
    setEditValue: (value: string) => void;
    cancelEditing: () => void;
  };
  onSave: (field: string, value: string) => Promise<void>;
  type?: 'text' | 'number' | 'tel' | 'textarea' | 'select' | 'gender';
  options?: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

export function EditableField({
  field,
  label,
  value,
  displayValue,
  isOwner,
  editMode,
  onSave,
  type = 'text',
  options,
  placeholder,
  className,
}: EditableFieldProps) {
  const { editingField, editValue, startEditing, setEditValue, cancelEditing } = editMode;
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const isEditing = editingField === field;

  const handleSave = async () => {
    await onSave(field, editValue);
  };

  if (isEditing) {
    return (
      <div className={styles.editContainer}>
        {type === 'select' || type === 'gender' ? (
          <div className={styles.dropdownWrapper}>
            <button
              onClick={() => setDropdownOpen(dropdownOpen === field ? null : field)}
              className={styles.dropdownBtn}
            >
              {editValue || placeholder || 'Select'}
              <span className={styles.dropdownArrow}>{dropdownOpen === field ? '▲' : '▼'}</span>
            </button>
            {dropdownOpen === field && options && (
              <div className={styles.dropdownMenu}>
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setEditValue(option.value);
                      setDropdownOpen(null);
                    }}
                    className={`${styles.dropdownItem} ${editValue === option.value ? styles.selected : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : type === 'textarea' ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={styles.editTextarea}
            autoFocus
          />
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={styles.editInput}
            autoFocus
          />
        )}
        <div className={styles.editButtons}>
          <button onClick={handleSave} className={styles.applyBtn}>
            Save
          </button>
          <button onClick={cancelEditing} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <span className={styles.detailLabel}>{label}</span>}
      <span className={styles.detailValue}>
        {displayValue || value}
        {isOwner && (
          <button onClick={() => startEditing(field, value)} className={styles.editIcon}>
            ✏️
          </button>
        )}
      </span>
    </div>
  );
}
