'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useAd } from '@/hooks/useAds';
import { useMyProfiles } from '@/hooks/useMyProfiles';
import { useAuthStore } from '@/stores/authStore';
import { useCities } from '@/hooks/useCities';
import { useEditMode } from '@/hooks/useEditMode';
import { getAssetUrl } from '@/lib/utils';
import { Lightbox } from '@/components/ui/Lightbox';
import { AdViewAvatar } from './AdViewAvatar';
import { AdViewGallery } from './AdViewGallery';
import styles from './AdView.module.css';

interface AdViewProps {
  id: number;
}

interface Ad {
  id: number;
  name: string;
  age: number;
  tel: string;
  about?: string;
  height?: number;
  weight?: number;
  gender: 'FEMALE' | 'MALE' | 'TRANS';
  avatar?: string;
  photos: string[];
  languages?: string[];
  city: {
    id: number;
    nameRu: string;
    nameEn: string;
  };
  userId: number;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

export function AdView({ id }: AdViewProps) {
  const t = useTranslations('Ad');
  const locale = useLocale();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { data: ad, isLoading, refetch } = useAd(id);
  const { updateProfile, isUpdating } = useMyProfiles();
  const { data: cities } = useCities(locale === 'ru' ? 'ru' : 'en');

  const editMode = useEditMode();
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // State for file uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const isOwner = user && ad && user.id === ad.userId;
  const isAdsRoute = pathname.startsWith(`/${locale}/ads/`) && !pathname.includes('/profiles/');

  const avatarUrl = getAssetUrl(ad?.avatar || null);

  const handleSave = async (field: string, value: string) => {
    try {
      await updateProfile({ profileId: id, data: { [field]: value } });
      refetch();
      editMode.cancelEditing();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPreviewAvatar(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPhotos((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDeletePhoto = async (index: number) => {
    if (!window.confirm(t('confirmDeletePhoto'))) return;

    try {
      const updatedPhotos = [...ad!.photos];
      updatedPhotos.splice(index, 1);
      await updateProfile({ profileId: id, data: { photos: updatedPhotos } });
      refetch();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const openLightbox = (startIndex: number) => {
    setLightboxStartIndex(startIndex);
    setLightboxOpen(true);
  };

  const handleDeleteFromLightbox = async (index: number) => {
    await handleDeletePhoto(index);
    setLightboxOpen(false);
  };

  const saveAllChanges = async () => {
    try {
      const formData = new FormData();

      if (avatarFile) formData.append('avatar', avatarFile);
      newPhotos.forEach((photo) => formData.append('photos', photo));
      if (editMode.editingField && editMode.editValue) {
        formData.append(editMode.editingField, editMode.editValue);
      }

      if (avatarFile || newPhotos.length > 0) {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/profiles/${id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to update profile');

        setAvatarFile(null);
        setNewPhotos([]);
        setPreviewAvatar(null);
      } else if (editMode.editingField && editMode.editValue) {
        await handleSave(editMode.editingField, editMode.editValue);
      }

      refetch();
      editMode.cancelEditing();
      setDropdownOpen(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setPreviewAvatar(null);
  };

  const handleCancelPhotos = () => {
    setAvatarFile(null);
    setNewPhotos([]);
    setPreviewAvatar(null);
  };

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

  if (!ad) return <p className="text-center text-gray-500">Ad not found</p>;

  const genderOptions = [
    { label: t('female'), value: 'FEMALE' },
    { label: t('male'), value: 'MALE' },
    { label: t('trans'), value: 'TRANS' },
  ];

  const cityOptions = (cities || []).map((city: City) => ({
    label: city.name,
    value: city.name,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <AdViewAvatar
          avatarUrl={avatarUrl}
          previewAvatar={previewAvatar}
          name={ad.name}
          isOwner={!!isOwner}
          isAdsRoute={!!isAdsRoute}
          onAvatarChange={handleAvatarChange}
          onSave={saveAllChanges}
          onCancel={handleCancelAvatar}
          hasAvatarFile={!!avatarFile}
          isUpdating={isUpdating}
          savingText={t('saving')}
          applyText={t('apply')}
          cancelText={t('cancel')}
          changeAvatarText={t('changeAvatar')}
        />

        <div className={styles.content}>
          <h2 className={styles.title}>
            {editMode.editingField === 'name' ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editMode.editValue}
                  onChange={(e) => editMode.setEditValue(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <div className={styles.editButtons}>
                  <button
                    onClick={saveAllChanges}
                    className={styles.applyBtn}
                    disabled={isUpdating || (!editMode.editValue && !avatarFile && newPhotos.length === 0)}
                  >
                    {isUpdating ? t('saving') : t('apply')}
                  </button>
                  <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {ad.name}, {ad.age}
                {isOwner && (
                  <button
                    onClick={() => editMode.startEditing('name', ad.name)}
                    className={styles.editIcon}
                  >
                    ✏️
                  </button>
                )}
              </>
            )}
          </h2>

          {editMode.editingField === 'city' ? (
            <div className={styles.editContainer}>
              <div className={styles.dropdownWrapper}>
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'city' ? null : 'city')}
                  className={styles.dropdownBtn}
                >
                  {editMode.editValue || t('selectCity')}
                  <span className={styles.dropdownArrow}>{dropdownOpen === 'city' ? '▲' : '▼'}</span>
                </button>
                {dropdownOpen === 'city' && (
                  <div className={styles.dropdownMenu}>
                    {cityOptions.map((city) => (
                      <button
                        key={city.value}
                        onClick={() => {
                          editMode.setEditValue(city.value);
                          setDropdownOpen(null);
                        }}
                        className={`${styles.dropdownItem} ${editMode.editValue === city.value ? styles.selected : ''}`}
                      >
                        {city.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.editButtons}>
                <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                  {isUpdating ? t('saving') : t('apply')}
                </button>
                <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                  {t('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p className={styles.city}>
              {locale === 'ru' ? ad.city.nameRu : ad.city.nameEn}
              {isOwner && (
                <button
                  onClick={() => editMode.startEditing('city', locale === 'ru' ? ad.city.nameRu : ad.city.nameEn)}
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
                {editMode.editingField === 'gender' ? (
                  <div className={styles.editContainer}>
                    <div className={styles.dropdownWrapper}>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === 'gender' ? null : 'gender')}
                        className={styles.dropdownBtn}
                      >
                        {editMode.editValue ? t(editMode.editValue.toLowerCase()) : t('selectGender')}
                        <span className={styles.dropdownArrow}>{dropdownOpen === 'gender' ? '▲' : '▼'}</span>
                      </button>
                      {dropdownOpen === 'gender' && (
                        <div className={styles.dropdownMenu}>
                          {genderOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                editMode.setEditValue(option.value);
                                setDropdownOpen(null);
                              }}
                              className={`${styles.dropdownItem} ${editMode.editValue === option.value ? styles.selected : ''}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={styles.editButtons}>
                      <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                        {isUpdating ? t('saving') : t('apply')}
                      </button>
                      <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {t(ad.gender.toLowerCase())}
                    {isOwner && (
                      <button
                        onClick={() => editMode.startEditing('gender', ad.gender)}
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
                  {editMode.editingField === 'height' ? (
                    <div className={styles.editContainer}>
                      <input
                        type="number"
                        value={editMode.editValue}
                        onChange={(e) => editMode.setEditValue(e.target.value)}
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editButtons}>
                        <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                          {isUpdating ? t('saving') : t('apply')}
                        </button>
                        <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {ad.height} {t('cm')}
                      {isOwner && (
                        <button
                          onClick={() => editMode.startEditing('height', ad.height)}
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
                  {editMode.editingField === 'weight' ? (
                    <div className={styles.editContainer}>
                      <input
                        type="number"
                        value={editMode.editValue}
                        onChange={(e) => editMode.setEditValue(e.target.value)}
                        className={styles.editInput}
                        autoFocus
                      />
                      <div className={styles.editButtons}>
                        <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                          {isUpdating ? t('saving') : t('apply')}
                        </button>
                        <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {ad.weight} {t('kg')}
                      {isOwner && (
                        <button
                          onClick={() => editMode.startEditing('weight', ad.weight)}
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
              {editMode.editingField === 'about' ? (
                <div className={styles.editContainer}>
                  <textarea
                    value={editMode.editValue}
                    onChange={(e) => editMode.setEditValue(e.target.value)}
                    className={styles.editTextarea}
                    autoFocus
                  />
                  <div className={styles.editButtons}>
                    <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                      {isUpdating ? t('saving') : t('apply')}
                    </button>
                    <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
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
                        onClick={() => editMode.startEditing('about', ad.about)}
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
                    {isOwner && editMode.editingField === 'languages' && (
                      <button
                        onClick={() => editMode.startEditing('languages', ad.languages.join(','))}
                        className={styles.editIcon}
                      >
                        ✏️
                      </button>
                    )}
                  </span>
                ))}

                {isOwner && !editMode.editingField?.startsWith('language') && (
                  <button
                    onClick={() => editMode.startEditing('languages', ad.languages.join(','))}
                    className={styles.editTagButton}
                  >
                    ✏️
                  </button>
                )}
              </div>

              {editMode.editingField === 'languages' && (
                <div className={styles.editContainer}>
                  <input
                    type="text"
                    value={editMode.editValue}
                    onChange={(e) => editMode.setEditValue(e.target.value)}
                    placeholder={t('languagesPlaceholder')}
                    className={styles.editInput}
                    autoFocus
                  />
                  <div className={styles.editButtons}>
                    <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                      {isUpdating ? t('saving') : t('apply')}
                    </button>
                    <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                      {t('cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.section}>
            {editMode.editingField === 'tel' ? (
              <div className={styles.editContainer}>
                <input
                  type="tel"
                  value={editMode.editValue}
                  onChange={(e) => editMode.setEditValue(e.target.value)}
                  className={styles.editInput}
                  autoFocus
                />
                <div className={styles.editButtons}>
                  <button onClick={saveAllChanges} className={styles.applyBtn} disabled={isUpdating}>
                    {isUpdating ? t('saving') : t('apply')}
                  </button>
                  <button onClick={editMode.cancelEditing} className={styles.cancelBtn}>
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <a href={`tel:${ad.tel}`} className={styles.contactBtn}>
                  {t('contact')}: {ad.tel}
                  {isOwner && (
                    <button
                      onClick={() => editMode.startEditing('tel', ad.tel)}
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

        <AdViewGallery
          photos={ad.photos}
          newPhotos={newPhotos}
          adName={ad.name}
          isOwner={!!isOwner}
          isAdsRoute={!!isAdsRoute}
          onPhotoClick={openLightbox}
          onAddPhotos={handleAddPhotos}
          onSave={saveAllChanges}
          onCancel={handleCancelPhotos}
          hasChanges={!!avatarFile || newPhotos.length > 0}
          isUpdating={isUpdating}
          savingText={t('saving')}
          applyText={t('apply')}
          cancelText={t('cancel')}
          addPhotosText={t('addPhotos')}
          galleryText={t('gallery')}
        />
      </div>

      {lightboxOpen && (
        <Lightbox
          images={ad.photos.map((photo: string) => getAssetUrl(photo)!)}
          startIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
          onDelete={isOwner && isAdsRoute ? handleDeleteFromLightbox : undefined}
          showDelete={!!isOwner && isAdsRoute}
        />
      )}
    </div>
  );
}
