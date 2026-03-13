'use client';

import { useLocale, useRouter, usePathname } from 'next-intl';

const locales = ['en', 'ru'] as const;
const localeNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as 'en' | 'ru' });
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-md hover:border-pink-400 transition cursor-pointer"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
