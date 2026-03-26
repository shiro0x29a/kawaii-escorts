'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import styles from './page.module.css';

export default function AdsPage() {
  const t = useTranslations('Ads');
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        {!isAuthenticated && (
          <div className={styles.loginPrompt}>
            <p className={styles.loginPromptText}>
              {t('loginToViewAds')}
            </p>
            <Link
              href="/login"
              className={styles.loginBtn}
            >
              {t('login')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
