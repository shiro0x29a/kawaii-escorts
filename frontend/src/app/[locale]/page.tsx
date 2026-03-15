import { getTranslations } from 'next-intl/server';
import { SearchBox } from '@/components/SearchBox';
import { Profiles } from '@/components/Profiles';
import styles from './page.module.css';

export default async function HomePage() {
  const t = await getTranslations('Home');

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
            <SearchBox placeholder={t('searchPlaceholder')} />
          </div>
        </div>
      </section>

      <Profiles />
    </div>
  );
}
