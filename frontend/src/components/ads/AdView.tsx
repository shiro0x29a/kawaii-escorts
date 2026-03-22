'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAd } from '@/hooks/use-ads';
import { useMyProfiles } from '@/hooks/useMyProfiles';
import { useAuthStore } from '@/stores/auth-store';
import styles from './AdView.module.css';

interface AdViewProps {
  id: number;
}

const API_URL = '';

export function AdView({ id }: AdViewProps) {
  const t = useTranslations('Ad');
  const { user } = useAuthStore();
  const { data: ad, isLoading, refetch } = useAd(id);
  const { updateProfile, isUpdating } = useMyProfiles();

  // State for managing edit modes
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Check if current user owns this ad
  const isOwner = user && ad && user.id === ad.userId;

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

  const avatarUrl = ad.avatar
    ? ad.avatar.startsWith('http')
      ? ad.avatar
      : `/api${ad.avatar.startsWith('/') ? ad.avatar : `/${ad.avatar}`}`
    : null;

  // Function to start editing a field
  const startEditing = (fieldName: string, currentValue: any) => {
    setEditingField(fieldName);
    setEditValue(currentValue?.toString() || '');
  };

  // Function to save changes
  const saveChanges = async () => {
    if (!editingField || !editValue) return;

    try {
      await updateProfile({
        profileId: id,
        data: { [editingField]: editValue }
      });

      // Refetch the ad data to reflect changes
      refetch();
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={ad.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className={styles.noAvatar}>No Avatar</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            {editingField === 'name' ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <div className={styles.editButtons}>
                  <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                    {isUpdating ? t('saving') : t('apply')}
                  </button>
                  <button onClick={cancelEditing} className={styles.cancelBtn}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {ad.name}, {ad.age}
                {isOwner && (
                  <button
                    onClick={() => startEditing('name', ad.name)}
                    className={styles.editIcon}
                  >
                    ✏️
                  </button>
                )}
              </>
            )}
          </h1>

          {editingField === 'city' ? (
            <div className={styles.editContainer}>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.editButtons}>
                <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                  {isUpdating ? t('saving') : t('apply')}
                </button>
                <button onClick={cancelEditing} className={styles.cancelBtn}>
                  {t('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.city}>
              {ad.city.nameEn}
              {isOwner && (
                <button
                  onClick={() => startEditing('city', ad.city.nameEn)}
                  className={styles.editIcon}
                >
                  ✏️
                </button>
              )}
            </p>
          )}

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t('gender')}</span>
              <span className={styles.detailValue}>
                {editingField === 'gender' ? (
                  <div className={styles.editContainer}>
                    <select
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className={styles.editSelect}
                      autoFocus
                    >
                      <option value="female">{t('female')}</option>
                      <option value="male">{t('male')}</option>
                      <option value="trans">{t('trans')}</option>
                    </select>
                    <div className={styles.editButtons}>
                      <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                        {isUpdating ? t('saving') : t('apply')}
                      </button>
                      <button onClick={cancelEditing} className={styles.cancelBtn}>
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {t(ad.gender.toLowerCase())}
                    {isOwner && (
                      <button
                        onClick={() => startEditing('gender', ad.gender)}
                        className={styles.editIcon}
                      >
                        ✏️
                      </button>
                    )}
                  </>
                )}
              </span>
            </div>

            {ad.height && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('height')}</span>
                <span className={styles.detailValue}>
                  {editingField === 'height' ? (
                    <div className={styles.editContainer}>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editButtons}>
                        <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                          {isUpdating ? t('saving') : t('apply')}
                        </button>
                        <button onClick={cancelEditing} className={styles.cancelBtn}>
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {ad.height} {t('cm')}
                      {isOwner && (
                        <button
                          onClick={() => startEditing('height', ad.height)}
                          className={styles.editIcon}
                        >
                          ✏️
                        </button>
                      )}
                    </>
                  )}
                </span>
              </div>
            )}

            {ad.weight && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('weight')}</span>
                <span className={styles.detailValue}>
                  {editingField === 'weight' ? (
                    <div className={styles.editContainer}>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editButtons}>
                        <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                          {isUpdating ? t('saving') : t('apply')}
                        </button>
                        <button onClick={cancelEditing} className={styles.cancelBtn}>
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {ad.weight} {t('kg')}
                      {isOwner && (
                        <button
                          onClick={() => startEditing('weight', ad.weight)}
                          className={styles.editIcon}
                        >
                          ✏️
                        </button>
                      )}
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          {ad.about && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('about')}</h3>
              {editingField === 'about' ? (
                <div className={styles.editContainer}>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className={styles.editTextarea}
                    autoFocus
                  />
                  <div className={styles.editButtons}>
                    <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                      {isUpdating ? t('saving') : t('apply')}
                    </button>
                    <button onClick={cancelEditing} className={styles.cancelBtn}>
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className={styles.sectionText}>
                    {ad.about}
                    {isOwner && (
                      <button
                        onClick={() => startEditing('about', ad.about)}
                        className={styles.editIcon}
                      >
                        ✏️
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {ad.languages && ad.languages.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>{t('languages')}</h3>
              <div className={styles.tags}>
                {ad.languages.map((lang: string) => (
                  <span key={lang} className={styles.tag}>
                    {lang}
                    {isOwner && editingField === 'languages' && (
                      <button
                        onClick={() => startEditing('languages', ad.languages.join(','))}
                        className={styles.editIcon}
                      >
                        ✏️
                      </button>
                    )}
                  </span>
                ))}

                {isOwner && !editingField?.startsWith('language') && (
                  <button
                    onClick={() => startEditing('languages', ad.languages.join(','))}
                    className={styles.editTagButton}
                  >
                    ✏️
                  </button>
                )}
              </div>

              {editingField === 'languages' && (
                <div className={styles.editContainer}>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder={t('languagesPlaceholder')}
                    className={styles.editInput}
                    autoFocus
                  />
                  <div className={styles.editButtons}>
                    <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                      {isUpdating ? t('saving') : t('apply')}
                    </button>
                    <button onClick={cancelEditing} className={styles.cancelBtn}>
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.section}>
            {editingField === 'tel' ? (
              <div className={styles.editContainer}>
                <input
                  type="tel"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <div className={styles.editButtons}>
                  <button onClick={saveChanges} className={styles.applyBtn} disabled={isUpdating}>
                    {isUpdating ? t('saving') : t('apply')}
                  </button>
                  <button onClick={cancelEditing} className={styles.cancelBtn}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <a
                  href={`tel:${ad.tel}`}
                  className={styles.contactBtn}
                >
                  {t('contact')}: {ad.tel}
                  {isOwner && (
                    <button
                      onClick={() => startEditing('tel', ad.tel)}
                      className={styles.editIcon}
                    >
                      ✏️
                    </button>
                  )}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {ad.photos && ad.photos.length > 0 && (
        <div className={styles.gallery}>
          <h3 className={styles.galleryTitle}>Gallery</h3>
          <div className={styles.galleryGrid}>
            {ad.photos.map((photo: string, index: number) => {
              const photoUrl = photo
                ? photo.startsWith('http')
                  ? photo
                  : `/api${photo.startsWith('/') ? photo : `/${photo}`}`
                : null;
              if (!photoUrl) return null;
              return (
                <div key={index} className={styles.galleryItem}>
                  <img
                    src={photoUrl}
                    alt={`${ad.name} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
