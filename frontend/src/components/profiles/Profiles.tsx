'use client';

import { useState } from 'react';
import { useAds } from '@/hooks/useAds';
import { getAssetUrl } from '@/lib/utils';
import { Tabs, Card, Pagination } from '@/components/ui';
import styles from './Profiles.module.css';

type Gender = 'FEMALE' | 'MALE' | 'TRANS';

const PROFILES_PER_PAGE = 6;

export function Profiles() {
  const [gender, setGender] = useState<Gender>('FEMALE');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAds({ limit: 20, gender });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const allProfiles = data?.data || [];
  const chunks = Array.from({ length: Math.ceil(allProfiles.length / PROFILES_PER_PAGE) }, (_, i) =>
    allProfiles.slice(i * PROFILES_PER_PAGE, (i + 1) * PROFILES_PER_PAGE)
  );
  const totalPages = chunks.length;
  const currentPageProfiles = chunks[page - 1] || [];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <Tabs
          tabs={[
            { label: 'Female', value: 'FEMALE' },
            { label: 'Male', value: 'MALE' },
            { label: 'Trans', value: 'TRANS' },
          ]}
          value={gender}
          onChange={(value) => { setGender(value as Gender); setPage(1); }}
        />

        <div className={styles.grid}>
          {currentPageProfiles.map((profile) => {
            const avatarUrl = getAssetUrl(profile.avatar);
            if (!avatarUrl) return null;
            return (
              <Card
                key={profile.id}
                href={`/profiles/${profile.id}`}
                image={avatarUrl}
                imageHeight="350px"
                title={`${profile.name}, ${profile.age}`}
                description={profile.city.nameEn}
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
    </section>
  );
}
