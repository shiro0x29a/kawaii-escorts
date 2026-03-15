'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SearchBox } from '@/components/search/SearchBox';
import { Profiles } from '@/components/profiles/Profiles';
import { SearchResults } from '@/components/search/SearchResults';
import styles from './page.module.css';

export default function HomePage() {
  const t = useTranslations('Home');
  const [searchCity, setSearchCity] = useState('');

  // Search automatically when city changes
  const showSearchResults = searchCity.trim().length > 0;

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
            <SearchBox
              placeholder={t('searchPlaceholder')}
              value={searchCity}
              onChange={setSearchCity}
              onSubmit={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </section>

      {showSearchResults ? (
        <div className={styles.container}>
          <SearchResults
            city={searchCity}
            showSearchBox={false}
          />
        </div>
      ) : (
        <Profiles />
      )}
    </div>
  );
}
