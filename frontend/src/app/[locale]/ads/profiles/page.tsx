'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import Link from 'next/link';
import { useMyProfiles } from '@/hooks/useMyProfiles';
import { Pagination } from '@/components/shared/Pagination';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

export default function ProfilesPage() {
  const t = useTranslations('Ads.profiles');
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyProfiles({ page, limit: 6 });

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

  const profiles = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

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
        ) : profiles.length > 0 ? (
          <>
            <div className={styles.grid}>
              {profiles.map((profile) => {
                const avatarUrl = profile.avatar ? `${API_URL}${profile.avatar.startsWith('/') ? profile.avatar : `/${profile.avatar}`}` : null;
                if (!avatarUrl) return null;
                return (
                  <Link
                    key={profile.id}
                    href={`/ads/${profile.id}`}
                    className={styles.card}
                  >
                    <img
                      src={avatarUrl}
                      alt={profile.name}
                      className={styles.avatar}
                    />
                    <div className={styles.info}>
                      <h3 className={styles.name}>{profile.name}, {profile.age}</h3>
                      <p className={styles.city}>{profile.city.nameEn}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
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
