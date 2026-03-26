'use client';

import styles from './AdView.module.css';

interface AdViewAvatarProps {
  avatarUrl: string | null;
  previewAvatar: string | null;
  name: string;
  isOwner: boolean;
  isAdsRoute: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  hasAvatarFile: boolean;
  isUpdating: boolean;
  savingText: string;
  applyText: string;
  cancelText: string;
  changeAvatarText: string;
}

export function AdViewAvatar({
  avatarUrl,
  previewAvatar,
  name,
  isOwner,
  isAdsRoute,
  onAvatarChange,
  onSave,
  onCancel,
  hasAvatarFile,
  isUpdating,
  savingText,
  applyText,
  cancelText,
  changeAvatarText,
}: AdViewAvatarProps) {
  return (
    <div className={styles.imageWrapper}>
      {avatarUrl || previewAvatar ? (
        <img
          src={previewAvatar || avatarUrl!}
          alt={name}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className={styles.noAvatar}>No Avatar</div>
      )}

      {isOwner && isAdsRoute && (
        <div className={styles.avatarControls}>
          <label htmlFor="avatar-upload" className={styles.uploadLabel}>
            {changeAvatarText}
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className={styles.fileInput}
          />

          {hasAvatarFile && (
            <div className={styles.editButtons}>
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
      )}
    </div>
  );
}
