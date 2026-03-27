import { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';

export interface CardProps {
  href?: string;
  image?: string;
  imageHeight?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'borderless';
  size?: 'compact' | 'default' | 'comfortable';
  isLoading?: boolean;
}

export function Card({
  href,
  image,
  imageHeight = '16rem',
  title,
  description,
  children,
  className = '',
  variant = 'default',
  size = 'default',
  isLoading = false,
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isLoading) {
    return (
      <div className={styles.skeleton}>
        <div className={styles.skeletonImage} style={{ height: imageHeight }} />
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonText} />
        </div>
      </div>
    );
  }

  const content = (
    <>
      {image && (
        <div className={styles.imageWrapper} style={{ height: imageHeight }}>
          <img src={image} alt={title || ''} />
        </div>
      )}
      {(title || description || children) && (
        <div className={styles.content}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
          {children}
        </div>
      )}
    </>
  );

  if (href) {
    return <Link href={href} className={classNames}>{content}</Link>;
  }

  return <div className={classNames}>{content}</div>;
}
