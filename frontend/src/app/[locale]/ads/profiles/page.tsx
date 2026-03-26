'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { AdsList } from '@/components/ads/AdsList';
import styles from './page.module.css';

export default function ProfilesPage() {
  const t = useTranslations('Ads.profiles');
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>{t('myProfiles')}</h1>
          <div className={styles.loginPrompt}>
            <p className={styles.loginPromptText}>
              {t('loginToView')}
            </p>
            <Link href="/login" className={styles.loginBtn}>
              {t('login')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('myProfiles')}</h1>
          <Link href="/ads/profiles/add" className={styles.addBtn}>
            {t('addProfile')}
          </Link>
        </div>
        <AdsList />
      </div>
    </div>
  );
}
