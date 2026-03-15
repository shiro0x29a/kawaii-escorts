'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAd } from '@/hooks/use-ads';
import styles from './AdView.module.css';

interface AdViewProps {
  id: number;
}

export function AdView({ id }: AdViewProps) {
  const t = useTranslations('Ad');
  const { data: ad, isLoading } = useAd(id);

  if (isLoading) {
    return (
      <div className={styles.skeleton}>
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} />
          </div>
        </div>
      </div>
    );
  }

  if (!ad) {
    return <p className="text-center text-gray-500">Ad not found</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          <Image src={ad.avatar} alt={ad.name} fill className="object-cover" />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            {ad.name}, {ad.age}
          </h1>
          <p className={styles.city}>{ad.city.nameEn}</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t('gender')}</span>
              <span className={styles.detailValue}>{t(ad.gender.toLowerCase())}</span>
            </div>
            {ad.height && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('height')}</span>
                <span className={styles.detailValue}>{ad.height} {t('cm')}</span>
              </div>
            )}
            {ad.weight && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('weight')}</span>
                <span className={styles.detailValue}>{ad.weight} {t('kg')}</span>
              </div>
            )}
          </div>

          {ad.about && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('about')}</h3>
              <p className={styles.sectionText}>{ad.about}</p>
            </div>
          )}

          {ad.languages && ad.languages.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('languages')}</h3>
              <div className={styles.tags}>
                {ad.languages.map((lang: string) => (
                  <span key={lang} className={styles.tag}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <a
              href={`tel:${ad.tel}`}
              className={styles.contactBtn}
            >
              {t('contact')}: {ad.tel}
            </a>
          </div>
        </div>
      </div>

      {ad.photos && ad.photos.length > 0 && (
        <div className={styles.gallery}>
          <h3 className={styles.galleryTitle}>Gallery</h3>
          <div className={styles.galleryGrid}>
            {ad.photos.map((photo: string, index: number) => (
              <div key={index} className={styles.galleryItem}>
                <Image src={photo} alt={`${ad.name} ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
