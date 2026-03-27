import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'simple' | 'numbered';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showPageInfo?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
  size = 'medium',
  className = '',
  showPageInfo = true,
}: PaginationProps) {
  const classNames = [
    styles.pagination,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className={classNames}>
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>

      {variant === 'numbered' ? (
        <>
          {pages.map((page) => (
            <button
              key={page}
              className={`${styles.button} ${page === currentPage ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </>
      ) : showPageInfo ? (
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
      ) : null}

      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
}

function getPageNumbers(current: number, total: number): number[] {
  const pages: number[] = [];
  const showEdges = total <= 7;

  if (showEdges) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, -1, total);
  } else if (current >= total - 3) {
    pages.push(1, -1, total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, -1, current - 1, current, current + 1, -1, total);
  }

  return pages;
}
