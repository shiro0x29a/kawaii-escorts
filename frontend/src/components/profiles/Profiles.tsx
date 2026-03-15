'use client';

import { useState } from 'react';
import { useAds } from '@/hooks/use-ads';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Profiles.module.css';

type Gender = 'FEMALE' | 'MALE';

export function Profiles() {
  const [gender, setGender] = useState<Gender>('FEMALE');
  const { data, isLoading } = useAds({ limit: 6, gender });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${gender === 'FEMALE' ? styles.active : ''}`}
            onClick={() => setGender('FEMALE')}
          >
            Female
          </button>
          <button
            className={`${styles.tab} ${gender === 'MALE' ? styles.active : ''}`}
            onClick={() => setGender('MALE')}
          >
            Male
          </button>
        </div>

        <div className={styles.grid}>
          {data?.data?.map((profile) => (
            <Link key={profile.id} href={`/profiles/${profile.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{profile.name}, {profile.age}</h3>
                <p className={styles.city}>{profile.city.nameEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
