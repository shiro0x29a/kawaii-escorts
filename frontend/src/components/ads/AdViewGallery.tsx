'use client';

import { getAssetUrl } from '@/lib/utils';
import styles from './AdView.module.css';

interface Photo {
  url: string;
  isExisting: boolean;
  index: number;
}

interface AdViewGalleryProps {
  photos: string[];
  newPhotos: File[];
  adName: string;
  isOwner: boolean;
  isAdsRoute: boolean;
  onPhotoClick: (index: number) => void;
  onAddPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  hasChanges: boolean;
  isUpdating: boolean;
  savingText: string;
  applyText: string;
  cancelText: string;
  addPhotosText: string;
  galleryText: string;
}

export function AdViewGallery({
  photos,
  newPhotos,
  adName,
  isOwner,
  isAdsRoute,
  onPhotoClick,
  onAddPhotos,
  onSave,
  onCancel,
  hasChanges,
  isUpdating,
  savingText,
  applyText,
  cancelText,
  addPhotosText,
  galleryText,
}: AdViewGalleryProps) {
  const hasPhotos = photos && photos.length > 0;
  const hasNewPhotos = newPhotos.length > 0;

  if (!hasPhotos && !hasNewPhotos) {
    return null;
  }

  const allPhotos: Photo[] = [
    ...photos.map((photo, index) => ({
      url: getAssetUrl(photo)!,
      isExisting: true,
      index,
    })),
    ...newPhotos.map((photo, index) => ({
      url: URL.createObjectURL(photo),
      isExisting: false,
      index: photos.length + index,
    })),
  ];

  return (
    <div className={styles.rightGallery}>
      <h3 className={styles.rightGalleryTitle}>{galleryText}</h3>
      <div className={styles.horizontalScrollGallery}>
        {allPhotos.map((photo) => (
          <div
            key={`${photo.isExisting ? 'existing' : 'new'}-${photo.index}`}
            className={styles.horizontalGalleryItem}
            onClick={() => photo.isExisting && onPhotoClick(photo.index)}
          >
            <img
              src={photo.url}
              alt={`${adName} ${photo.index + 1}`}
              className={styles.horizontalGalleryImage}
            />
          </div>
        ))}
      </div>

      {isOwner && isAdsRoute && (
        <div className={styles.photoGalleryControls}>
          <div className={styles.photoActionsContainer}>
            <div className={styles.photoActionsLeft}>
              <div
                onClick={() => document.getElementById('photos-upload')?.click()}
                className={styles.addPhotoBtn}
              >
                {addPhotosText}
              </div>
              <input
                id="photos-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={onAddPhotos}
                className={styles.hiddenFileInput}
              />
            </div>
            <div className={styles.photoActionsRight}>
              {hasChanges && (
                <div className={styles.photoGalleryActions}>
                  <button
                    onClick={onSave}
                    className={styles.applyBtn}
                    disabled={isUpdating}
                  >
                    {isUpdating ? savingText : applyText}
                  </button>
                  <button onClick={onCancel} className={styles.cancelBtn}>
                    {cancelText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
