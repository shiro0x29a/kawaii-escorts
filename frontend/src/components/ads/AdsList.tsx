'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAds } from '@/hooks/useAds';
import { useState } from 'react';
import { Tabs, Card, Pagination } from '@/components/ui';
import { getAssetUrl } from '@/lib/utils';
import styles from './AdsList.module.css';

type Gender = 'FEMALE' | 'MALE' | 'TRANS';

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
          <Card key={i} isLoading imageHeight="16rem" />
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

  return (
    <div>
      <Tabs
        tabs={[
          { label: t('female'), value: 'FEMALE' },
          { label: t('male'), value: 'MALE' },
          { label: t('transgender'), value: 'TRANS' },
        ]}
        value={gender}
        onChange={(value) => { setGender(value as Gender); setPage(1); }}
      />

      <div className={styles.grid}>
        {currentPageProfiles.map((ad: any) => {
          const avatarUrl = getAssetUrl(ad.avatar);
          if (!avatarUrl) return null;
          return (
            <Card
              key={ad.id}
              href={`/ads/${ad.id}`}
              image={avatarUrl}
              imageHeight="16rem"
              title={`${ad.name}, ${ad.age}`}
              description={ad.city.nameEn}
            />
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
