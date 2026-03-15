'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAds } from '@/hooks/use-ads';
import { useState } from 'react';
import styles from './AdsList.module.css';

export function AdsList() {
  const t = useTranslations('Ads');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAds({ page, limit: 12 });

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

  return (
    <div>
      <div className={styles.grid}>
        {data.data.map((ad: any) => (
          <Link
            key={ad.id}
            href={`/ads/${ad.id}`}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={ad.avatar}
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
        ))}
      </div>

      {data.pagination.pages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.pages}
            className={styles.loadMoreBtn}
          >
            {t('loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
