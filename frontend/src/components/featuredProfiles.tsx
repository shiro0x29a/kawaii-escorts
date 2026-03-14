'use client';

import { useProfiles } from '@/hooks/use-profiles';
import { ProfileView } from './profileView';
import styles from './featuredProfiles.module.css';

export function FeaturedProfiles() {
  const { data: profiles, isLoading } = useProfiles({ limit: 6 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Profiles</h2>
        <div className={styles.grid}>
          {profiles?.map((profile) => (
            <ProfileView key={profile.id} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
