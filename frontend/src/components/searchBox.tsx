'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import styles from './searchBox.module.css';

interface SearchBoxProps {
  placeholder?: string;
}

export function SearchBox({ placeholder }: SearchBoxProps) {
  return (
    <div className={styles.searchBox}>
      <MagnifyingGlassIcon className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
      />
    </div>
  );
}
