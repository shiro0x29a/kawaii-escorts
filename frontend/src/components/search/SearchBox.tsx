'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCities } from '@/hooks/use-cities';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

export function SearchBox({ placeholder, value, onChange, onSubmit }: SearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: cities } = useCities('en');
  
  const handleClear = () => {
    onChange?.('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSelect = (cityName: string) => {
    onChange?.(cityName);
    setIsOpen(false);
  };

  const filteredCities = value
    ? cities?.filter((city) =>
        city.name?.toLowerCase().startsWith(value?.toLowerCase() || '')
      ) || []
    : cities || [];

  return (
    <div className={styles.searchBoxWrapper}>
      <form onSubmit={onSubmit} className={styles.searchBox}>
        <MagnifyingGlassIcon className={styles.icon} />
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
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

      {isOpen && filteredCities.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredCities.map((city) => (
            <li
              key={city.id}
              className={styles.suggestion}
              onMouseDown={() => handleSelect(city.name)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
