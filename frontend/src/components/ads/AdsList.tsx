'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAds } from '@/hooks/useAds';
import { useState } from 'react';
import { Pagination } from '@/components/ui';
import styles from './AdsList.module.css';

type Gender = 'FEMALE' | 'MALE';

const PROFILES_PER_PAGE = 6;

export function AdsList() {
  const t = useTranslations('Ads');
  const [gender, setGender] = useState<Gender>('FEMALE');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAds({ limit: 24, gender });

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonInfo}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonText} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.data?.length) {
    return null;
  }

  const allProfiles = data.data || [];
  const chunks = Array.from({ length: Math.ceil(allProfiles.length / PROFILES_PER_PAGE) }, (_, i) =>
    allProfiles.slice(i * PROFILES_PER_PAGE, (i + 1) * PROFILES_PER_PAGE)
  );
  const totalPages = chunks.length;
  const currentPageProfiles = chunks[page - 1] || [];

  console.log(allProfiles);
  console.log(chunks);
  console.log('Filtered profiles for pagination:', {
    page,
    totalPages,
    totalProfiles: allProfiles.length,
    gender,
    currentPageProfiles,
  });

  return (
    <div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${gender === 'FEMALE' ? styles.active : ''}`}
          onClick={() => { setGender('FEMALE'); setPage(1); }}
        >
          Female
        </button>
        <button
          className={`${styles.tab} ${gender === 'MALE' ? styles.active : ''}`}
          onClick={() => { setGender('MALE'); setPage(1); }}
        >
          Male
        </button>
      </div>

      <div className={styles.grid}>
        {currentPageProfiles.map((ad: any) => {
          const avatarUrl = ad.avatar
            ? ad.avatar.startsWith('http')
              ? ad.avatar
              : `/api${ad.avatar.startsWith('/') ? ad.avatar : `/${ad.avatar}`}`
            : null;
          if (!avatarUrl) return null;
          return (
            <Link
              key={ad.id}
              href={`/ads/${ad.id}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={avatarUrl}
                  alt={ad.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>
                  {ad.name}, {ad.age}
                </h3>
                <p className={styles.city}>{ad.city.nameEn}</p>
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
    </div>
  );
}
