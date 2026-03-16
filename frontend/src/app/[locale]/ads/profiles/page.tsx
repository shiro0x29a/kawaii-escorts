'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { useMyProfiles } from '@/hooks/useMyProfiles';
import styles from './page.module.css';

export default function ProfilesPage() {
  const t = useTranslations('Ads.profiles');
  const { isAuthenticated } = useAuthStore();
  const { data: profiles, isLoading } = useMyProfiles();

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

        {isLoading ? (
          <div className={styles.loading}>{t('loading')}</div>
        ) : profiles && profiles.length > 0 ? (
          <div className={styles.grid}>
            {profiles.map((profile) => (
              <Link
                key={profile.id}
                href={`/ads/${profile.id}`}
                className={styles.card}
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className={styles.avatar}
                />
                <div className={styles.info}>
                  <h3 className={styles.name}>{profile.name}, {profile.age}</h3>
                  <p className={styles.city}>{profile.city.nameEn}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t('noProfiles')}</p>
            <Link href="/ads/profiles/add" className={styles.addBtn}>
              {t('addProfile')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
