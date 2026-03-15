'use client';

import { useAds } from '@/hooks/use-ads';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Profiles.module.css';

export function Profiles() {
  const { data, isLoading } = useAds({ limit: 6 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Profiles</h2>
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
