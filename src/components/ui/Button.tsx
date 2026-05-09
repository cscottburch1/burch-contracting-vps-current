import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'ctaLight' | 'ctaOutlineLight';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const hasUtility = (className: string, tokenPrefix: string) => {
  const escaped = tokenPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)${escaped}[^\\s]*`).test(className);
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  href,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const hasBgClass = hasUtility(className, 'bg-');
  const hasTextClass = hasUtility(className, 'text-');
  const hasHoverBgClass = hasUtility(className, 'hover:bg-');
  const hasBorderClass = hasUtility(className, 'border-');

  const resolvedVariantStyles: Record<ButtonVariant, string> = {
    primary: `${hasBgClass ? '' : 'bg-blue-600'} ${hasTextClass ? '' : 'text-white'} ${hasHoverBgClass ? '' : 'hover:bg-blue-700'} shadow-md hover:shadow-lg`,
    secondary: `${hasBgClass ? '' : 'bg-gray-800'} ${hasTextClass ? '' : 'text-white'} ${hasHoverBgClass ? '' : 'hover:bg-gray-900'} shadow-md hover:shadow-lg`,
    outline: `${hasBorderClass ? '' : 'border-2 border-blue-600'} ${hasTextClass ? '' : 'text-blue-600'} ${hasHoverBgClass ? '' : 'hover:bg-blue-50'}`,
    ghost: `${hasTextClass ? '' : 'text-blue-600'} ${hasHoverBgClass ? '' : 'hover:bg-blue-50'}`,
    ctaLight: `${hasBgClass ? '' : 'bg-white'} ${hasTextClass ? '' : 'text-gray-900'} ${hasHoverBgClass ? '' : 'hover:bg-gray-100'} shadow-md hover:shadow-lg`,
    ctaOutlineLight: `${hasBorderClass ? '' : 'border-2 border-white'} ${hasTextClass ? '' : 'text-white'} ${hasHoverBgClass ? '' : 'hover:bg-white'} hover:text-gray-900`
  };

  const baseStyles = 'rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const combinedStyles = `${baseStyles} ${resolvedVariantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
};
