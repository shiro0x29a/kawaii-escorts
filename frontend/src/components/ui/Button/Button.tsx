import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

type ButtonAsAnchor = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button({
  as = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (as === 'a') {
    return (
      <a className={classNames} href={props.href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classNames} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
