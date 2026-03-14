'use client';

import { useEffect, useState } from 'react';
import styles from './themeSwitcher.module.css';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light');

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

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyTheme(e.target.value as Theme);
  };

  return (
    <div className={styles.switcher}>
      <select
        value={theme}
        onChange={handleThemeChange}
        className={styles.select}
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">💻 System</option>
      </select>
    </div>
  );
}
