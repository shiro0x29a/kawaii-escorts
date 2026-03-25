'use client';

import { useState } from 'react';
import { useAds } from '@/hooks/use-ads';
import Link from 'next/link';
import styles from './Profiles.module.css';
import { Pagination } from '@/components/shared/Pagination';

type Gender = 'FEMALE' | 'MALE';

const PROFILES_PER_PAGE = 6;

export function Profiles() {
  const [gender, setGender] = useState<Gender>('FEMALE');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAds({ limit: 20, gender });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const allProfiles = data?.data || [];
  const totalPages = data?.pagination?.pages || Math.ceil(allProfiles.length / PROFILES_PER_PAGE);
  const reversedProfiles = [...allProfiles].reverse();
  const startIdx = (page - 1) * PROFILES_PER_PAGE;
  const endIdx = startIdx + PROFILES_PER_PAGE;
  const currentPageProfiles = reversedProfiles.slice(startIdx, endIdx);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
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
          {currentPageProfiles.map((profile) => {
            const avatarUrl = profile.avatar
              ? profile.avatar.startsWith('http')
                ? profile.avatar
                : `/api${profile.avatar.startsWith('/') ? profile.avatar : `/${profile.avatar}`}`
              : null;
            if (!avatarUrl) return null;
            return (
              <Link key={profile.id} href={`/profiles/${profile.id}`} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={avatarUrl} alt={profile.name} className="object-cover w-full h-full" />
                </div>
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
      </div>
    </section>
  );
}
