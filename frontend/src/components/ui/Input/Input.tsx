import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'rounded';
  size?: 'small' | 'medium' | 'large';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      variant = 'default',
      size = 'medium',
      iconLeft,
      iconRight,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const classNames = [
      styles.input,
      styles[variant],
      styles[size],
      iconLeft ? styles.withIconLeft : '',
      iconRight ? styles.withIconRight : '',
      error ? styles.error : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.inputWrapper}>
        {label && <label className={styles.label}>{label}</label>}
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <input
          ref={ref}
          className={classNames}
          disabled={disabled}
          {...props}
        />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
