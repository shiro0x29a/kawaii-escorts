'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import styles from './SearchBox.module.css';

export interface SearchSuggestion {
  label: string;
  value: string;
}

export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionSelect?: (value: string) => void;
  className?: string;
  variant?: 'default' | 'small';
  fullWidth?: boolean;
  debounceMs?: number;
}

export function SearchBox({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  onSuggestionSelect,
  className = '',
  variant = 'default',
  fullWidth = false,
  debounceMs = 300,
}: SearchBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      onSearch?.(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange('');
    onSearch?.('');
  };

  const handleSuggestionClick = (suggestionValue: string) => {
    onChange(suggestionValue);
    onSuggestionSelect?.(suggestionValue);
    setIsFocused(false);
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  const classNames = [
    styles.searchBoxWrapper,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} ref={searchRef}>
      <div className={styles.searchBox}>
        <MagnifyingGlassIcon className={styles.icon} />
        <input
          type="text"
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
        />
        {value && (
          <button className={styles.clearBtn} onClick={handleClear} type="button">
            <XMarkIcon className={styles.clearIcon} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.value}
              className={styles.suggestion}
              onClick={() => handleSuggestionClick(suggestion.value)}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
