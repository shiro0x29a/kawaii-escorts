'use client';

import { useParams } from 'next/navigation';
import { AdView } from '@/components/ads/AdView';
import styles from './page.module.css';

export default function ProfilePage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <div className={styles.page}>
      <AdView id={id} />
    </div>
  );
}
