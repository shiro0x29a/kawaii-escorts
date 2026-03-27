'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Lightbox.module.css';

interface LightboxProps {
  images: string[];
  startIndex?: number;
  onClose: () => void;
  onDelete?: (index: number) => void;
  showDelete?: boolean;
}

export function Lightbox({
  images,
  startIndex = 0,
  onClose,
  onDelete,
  showDelete = false
}: LightboxProps) {
  const t = useTranslations('Ad');
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const goToPrevious = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 150); // Match animation duration
  };

  const goToNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 150); // Match animation duration
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(currentIndex);
    }
  };

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div className={styles.lightboxContainer} onClick={(e) => e.stopPropagation()}>
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous image"
            >
              &lt;
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next image"
            >
              &gt;
            </button>
          </>
        )}

        {/* Close button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ×
        </button>

        {/* Delete button (only shown if onDelete is provided and showDelete is true) */}
        {showDelete && onDelete && (
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Delete image"
          >
            {t('delete')}
          </button>
        )}

        {/* Image counter */}
        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>

        {/* Image container */}
        <div className={styles.imageContainer}>
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className={`${styles.lightboxImage} ${isAnimating ? styles.animating : ''}`}
          />
        </div>
      </div>
    </div>
  );
}

