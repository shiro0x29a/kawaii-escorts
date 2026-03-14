'use client';

import { useAds } from '@/hooks/use-ads';
import Image from 'next/image';
import Link from 'next/link';
import styles from './featuredAds.module.css';

export function FeaturedAds() {
  const { data: ads, isLoading } = useAds({ limit: 6 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Ads</h2>
        <div className={styles.grid}>
          {ads?.map((ad) => (
            <Link key={ad.id} href={`/ads/${ad.id}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={ad.avatar} alt={ad.name} fill className="object-cover" />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{ad.name}, {ad.age}</h3>
                <p className={styles.city}>{ad.city.nameEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
