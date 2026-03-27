'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import styles from './Dropdown.module.css';

interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  renderTrigger?: (selectedOption?: DropdownOption) => ReactNode;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select',
  className = '',
  renderTrigger,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {renderTrigger ? (
          renderTrigger(selectedOption)
        ) : (
          <span>{selectedOption?.label || placeholder}</span>
        )}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.menuItem} ${option.value === value ? styles.active : ''}`}
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
