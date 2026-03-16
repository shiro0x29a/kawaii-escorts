'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeSwitcher.module.css';

type Theme = 'light' | 'dark' | 'system';

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: 'system', label: 'System', icon: '💻' },
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const initialTheme = saved || 'light';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === 'system') {
      root.removeAttribute('data-theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.setAttribute('data-theme', 'dark');
      }
    } else {
      root.setAttribute('data-theme', newTheme);
    }

    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <div className={styles.switcher}>
      <div className={styles.dropdown}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.dropdownButton}
        >
          {currentTheme?.icon} {currentTheme?.label}
          <svg className={`${styles.arrow} ${isOpen ? styles.open : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {themes.map(({ value, label, icon }) => (
              <div
                key={value}
                onClick={() => {
                  applyTheme(value);
                  setIsOpen(false);
                }}
                className={`${styles.dropdownItem} ${theme === value ? styles.active : ''}`}
              >
                {icon} {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
