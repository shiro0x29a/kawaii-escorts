import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  variant?: 'default' | 'rounded';
  inputSize?: 'small' | 'medium' | 'large';
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
      inputSize = 'medium',
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
      styles[inputSize],
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
