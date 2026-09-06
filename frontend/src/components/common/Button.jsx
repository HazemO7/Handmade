import React from 'react';

/**
 * HABA Button Component
 * Variants: primary (Plum), secondary (Ivory+border), outline (Plum border), ghost, danger
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  fullWidth = false,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-body font-medium tracking-widest uppercase transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary: {
      backgroundColor: '#542A3A',
      color: '#F7F1E8',
      border: 'none',
      borderRadius: '3px',
    },
    secondary: {
      backgroundColor: '#F7F1E8',
      color: '#542A3A',
      border: '1px solid #542A3A',
      borderRadius: '3px',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#542A3A',
      border: '1px solid #542A3A',
      borderRadius: '3px',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#542A3A',
      border: 'none',
      borderRadius: '3px',
    },
    danger: {
      backgroundColor: '#b91c1c',
      color: '#fff',
      border: 'none',
      borderRadius: '3px',
    },
  };

  const sizeStyles = {
    sm: { padding: '8px 18px', fontSize: '11px', letterSpacing: '0.13em' },
    md: { padding: '12px 28px', fontSize: '12px', letterSpacing: '0.15em' },
    lg: { padding: '15px 36px', fontSize: '12px', letterSpacing: '0.16em' },
    icon: { padding: '10px', fontSize: '14px', letterSpacing: 'normal' },
  };

  const style = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
  };

  const hoverMap = {
    primary: { backgroundColor: '#3d1e2a' },
    secondary: { backgroundColor: '#E8C7B8' },
    outline: { backgroundColor: '#542A3A', color: '#F7F1E8' },
    ghost: { backgroundColor: '#f5eef1' },
    danger: { backgroundColor: '#991b1b' },
  };

  return (
    <button
      className={`${base} ${className}`}
      style={style}
      disabled={isLoading || props.disabled}
      onMouseEnter={e => !props.disabled && Object.assign(e.currentTarget.style, hoverMap[variant])}
      onMouseLeave={e => !props.disabled && Object.assign(e.currentTarget.style, variantStyles[variant])}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  );
};

export default Button;
