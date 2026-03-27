'use client';

import { useEffect, ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullWidth';
  variant?: 'default' | 'plain' | 'centered';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  variant = 'default',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const classNames = [
    styles.container,
    styles[size],
    styles[variant],
    isOpen ? styles.open : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={handleOverlayClick}
      />
      <div className={classNames}>
        {showCloseButton && (
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        )}
        <div className={styles.content}>
          {title && (
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
            </div>
          )}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </>
  );
}
