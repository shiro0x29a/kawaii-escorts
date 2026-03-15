'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

export function SearchBox({ placeholder, value, onChange, onSubmit }: SearchBoxProps) {
  const handleClear = () => {
    onChange?.('');
  };

  return (
    <form onSubmit={onSubmit} className={styles.searchBox}>
      <MagnifyingGlassIcon className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={styles.clearBtn}
          aria-label="Clear search"
        >
          <XMarkIcon className={styles.clearIcon} />
        </button>
      )}
    </form>
  );
}
