'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import styles from './LangSwitcher.module.css';

const locales = ['en', 'ru'] as const;
const localeNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
};
const localeFlags: Record<string, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
};

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    const pathnameWithoutLocale = pathname.replace(/^\/(en|ru)/, '');
    router.replace(`/${newLocale}${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className={styles.switcher}>
      <div className={styles.dropdown}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.dropdownButton}
        >
          {localeFlags[locale]} {localeNames[locale]}
          <svg className={`${styles.arrow} ${isOpen ? styles.open : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className={styles.dropdownMenu}>
            {locales.map((loc) => (
              <div
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`${styles.dropdownItem} ${locale === loc ? styles.active : ''}`}
              >
                {localeFlags[loc]} {localeNames[loc]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
