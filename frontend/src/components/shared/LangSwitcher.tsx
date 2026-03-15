'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import styles from './LangSwitcher.module.css';

const locales = ['en', 'ru'] as const;
const localeNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
};

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Remove the old locale from pathname
    const pathnameWithoutLocale = pathname.replace(/^\/(en|ru)/, '');
    router.replace(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className={styles.switcher}>
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className={styles.select}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className={styles.option}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
