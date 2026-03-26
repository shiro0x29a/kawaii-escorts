'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useAd } from '@/hooks/use-ads';
import { useMyProfiles } from '@/hooks/useMyProfiles';
import { useAuthStore } from '@/stores/auth-store';
import { useCities } from '@/hooks/use-cities';
import { Lightbox } from '@/components/ui/Lightbox';
import styles from './AdView.module.css';

interface AdViewProps {
  id: number;
}


export function AdView({ id }: AdViewProps) {
  const t = useTranslations('Ad');
  const locale = useLocale();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { data: ad, isLoading, refetch } = useAd(id);
  const { updateProfile, isUpdating } = useMyProfiles();
  const { data: cities } = useCities(locale === 'ru' ? 'ru' : 'en');

  // State for managing edit modes
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // State for file uploads
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [deletingPhotoIndex, setDeletingPhotoIndex] = useState<number | null>(null);

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // Check if current user owns this ad
  const isOwner = user && ad && user.id === ad.userId;

  // Check if we're on the ads management route (where delete should be allowed)
  const isAdsRoute = pathname.startsWith(`/${locale}/ads/`) && !pathname.includes('/profiles/');

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
  const startEditing = (fieldName: string, currentValue: string | number | boolean | undefined) => {
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

  // Function to handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Create a preview URL for the new avatar
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle adding new photos
  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewPhotos(prev => [...prev, ...files]);
    }
  };

  // Function to handle deleting a photo
  const handleDeletePhoto = async (index: number) => {
    if (!window.confirm(t('confirmDeletePhoto'))) return;

    setDeletingPhotoIndex(index);
    try {
      // We need to send a request to delete the specific photo
      // Since we don't have a specific endpoint for photo deletion,
      // we'll update the profile with the photos array excluding the deleted photo
      const updatedPhotos = [...ad.photos];
      updatedPhotos.splice(index, 1);

      await updateProfile({
        profileId: id,
        data: { photos: updatedPhotos }
      });

      // Refetch the ad data to reflect changes
      refetch();
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setDeletingPhotoIndex(null);
    }
  };

  // Function to open lightbox with a specific image
  const openLightbox = (startIndex: number) => {
    setLightboxStartIndex(startIndex);
    setLightboxOpen(true);
  };

  // Function to close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Function to handle photo deletion from lightbox
  const handleDeleteFromLightbox = async (index: number) => {
    await handleDeletePhoto(index);
    closeLightbox();
  };

  // Combine all photos for the lightbox (existing + new)
  const allPhotos = [...ad.photos.map((photo: string) =>
    photo.startsWith('http') ? photo : `/api${photo.startsWith('/') ? photo : `/${photo}`}`
  ), ...newPhotos.map(photo => URL.createObjectURL(photo))];

  // Function to save all changes including files
  const saveAllChanges = async () => {
    try {
      const formData = new FormData();

      // Add avatar file if selected
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      // Add new photos if any
      newPhotos.forEach(photo => {
        formData.append('photos', photo);
      });

      // Add any other field changes if not already being handled separately
      if (editingField && editValue) {
        formData.append(editingField, editValue);
      }

      // If there are files to upload, use multipart form data
      if (avatarFile || newPhotos.length > 0) {
        // We need to create a custom API call for multipart form data
        const token = localStorage.getItem('token'); // Get the auth token

        const response = await fetch(`/api/profiles/${id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        // Clear file states after successful upload
        setAvatarFile(null);
        setNewPhotos([]);
        setPreviewAvatar(null);
      } else {
        // If no files, use the existing updateProfile function
        if (editingField && editValue) {
          await updateProfile({
            profileId: id,
            data: { [editingField]: editValue }
          });
        }
      }

      // Refetch the ad data to reflect changes
      refetch();
      setEditingField(null);
      setEditValue('');
      setDropdownOpen(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
    setDropdownOpen(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.imageWrapper}>
          {avatarUrl || previewAvatar ? (
            <img
              src={previewAvatar || avatarUrl}
              alt={ad.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className={styles.noAvatar}>No Avatar</div>
          )}

          {/* Avatar upload controls for owner */}
          {isOwner && isAdsRoute && (
            <div className={styles.avatarControls}>
              <label htmlFor={`avatar-upload-${id}`} className={styles.uploadLabel}>
                {t('changeAvatar')}
              </label>
              <input
                id={`avatar-upload-${id}`}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.fileInput}
              />

              {/* Avatar-specific save/cancel buttons */}
              {avatarFile && (
                <div className={styles.editButtons}>
                  <button
                    onClick={saveAllChanges}
                    className={styles.applyBtn}
                    disabled={isUpdating}
                  >
                    {isUpdating ? t('saving') : t('apply')}
                  </button>
                  <button
                    onClick={() => {
                      setAvatarFile(null);
                      setPreviewAvatar(null);
                    }}
                    className={styles.cancelBtn}
                  >
                    {t('cancel')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>
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
                  <button
                    onClick={saveAllChanges}
                    className={styles.applyBtn}
                    disabled={isUpdating || (!editValue && !avatarFile && newPhotos.length === 0)}
                  >
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
          </h2>

          {editingField === 'city' ? (
            <div className={styles.editContainer}>
              <div className={styles.dropdownWrapper}>
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'city' ? null : 'city')}
                  className={styles.dropdownBtn}
                >
                  {editValue || t('selectCity')}
                  <span className={styles.dropdownArrow}>{dropdownOpen === 'city' ? '▲' : '▼'}</span>
                </button>
                {dropdownOpen === 'city' && (
                  <div className={styles.dropdownMenu}>
                    {cities?.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setEditValue(city.name);
                          setDropdownOpen(null);
                        }}
                        className={`${styles.dropdownItem} ${editValue === city.name ? styles.selected : ''}`}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              {locale === 'ru' ? ad.city.nameRu : ad.city.nameEn}
              {isOwner && (
                <button
                  onClick={() => startEditing('city', locale === 'ru' ? ad.city.nameRu : ad.city.nameEn)}
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
                    <div className={styles.dropdownWrapper}>
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === 'gender' ? null : 'gender')}
                        className={styles.dropdownBtn}
                      >
                        {editValue ? t(editValue.toLowerCase()) : t('selectGender')}
                        <span className={styles.dropdownArrow}>{dropdownOpen === 'gender' ? '▲' : '▼'}</span>
                      </button>
                      {dropdownOpen === 'gender' && (
                        <div className={styles.dropdownMenu}>
                          <button
                            onClick={() => {
                              setEditValue('FEMALE');
                              setDropdownOpen(null);
                            }}
                            className={`${styles.dropdownItem} ${editValue === 'FEMALE' ? styles.selected : ''}`}
                          >
                            {t('female')}
                          </button>
                          <button
                            onClick={() => {
                              setEditValue('MALE');
                              setDropdownOpen(null);
                            }}
                            className={`${styles.dropdownItem} ${editValue === 'MALE' ? styles.selected : ''}`}
                          >
                            {t('male')}
                          </button>
                          <button
                            onClick={() => {
                              setEditValue('TRANS');
                              setDropdownOpen(null);
                            }}
                            className={`${styles.dropdownItem} ${editValue === 'TRANS' ? styles.selected : ''}`}
                          >
                            {t('trans')}
                          </button>
                        </div>
                      )}
                    </div>
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

        {/* Gallery on the right side */}
        {(ad.photos && ad.photos.length > 0) || (isOwner && newPhotos.length > 0) ? (
          <div className={styles.rightGallery}>
            <h3 className={styles.rightGalleryTitle}>{ad.photos && ad.photos.length > 0 ? t('gallery') : t('gallery')}</h3>
            <div className={styles.horizontalScrollGallery}>
              {ad.photos?.map((photo: string, index: number) => {
                const photoUrl = photo
                  ? photo.startsWith('http')
                    ? photo
                    : `/api${photo.startsWith('/') ? photo : `/${photo}`}`
                  : null;
                if (!photoUrl) return null;
                return (
                  <div
                    key={`existing-${index}`}
                    className={styles.horizontalGalleryItem}
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={photoUrl}
                      alt={`${ad.name} ${index + 1}`}
                      className={styles.horizontalGalleryImage}
                    />
                  </div>
                );
              })}

              {/* Render new photos being added */}
              {newPhotos.map((photo, index) => {
                const previewUrl = URL.createObjectURL(photo);
                return (
                  <div key={`new-${index}`} className={styles.horizontalGalleryItem}>
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className={styles.horizontalGalleryImage}
                    />
                  </div>
                );
              })}
            </div>

            {/* Owner controls for adding photos */}
            {isOwner && isAdsRoute && (
              <div className={styles.photoGalleryControls}>
                <div className={styles.photoActionsContainer}>
                  <div className={styles.photoActionsLeft}>
                    <label htmlFor={`photos-upload-${id}`} className={styles.addPhotoBtn}>
                      {t('addPhotos')}
                    </label>
                    <input
                      id={`photos-upload-${id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddPhotos}
                      className={styles.hiddenFileInput}
                    />
                  </div>
                  <div className={styles.photoActionsRight}>
                    {/* Save all changes button for photo management */}
                    {(avatarFile || newPhotos.length > 0) && (
                      <div className={styles.photoGalleryActions}>
                        <button
                          onClick={saveAllChanges}
                          className={styles.applyBtn}
                          disabled={isUpdating}
                        >
                          {isUpdating ? t('saving') : t('saveChanges')}
                        </button>
                        <button
                          onClick={() => {
                            setAvatarFile(null);
                            setNewPhotos([]);
                            setPreviewAvatar(null);
                          }}
                          className={styles.cancelBtn}
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Lightbox for photo viewing */}
      {lightboxOpen && (
        <Lightbox
          images={allPhotos}
          startIndex={lightboxStartIndex}
          onClose={closeLightbox}
          onDelete={isOwner && isAdsRoute ? handleDeleteFromLightbox : undefined}
          showDelete={!!isOwner && isAdsRoute}
        />
      )}
    </div>
  );
}
