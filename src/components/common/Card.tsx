import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'highlighted' | 'success' | 'danger';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
}

const variantStyles = {
  default: 'bg-white border-gray-200',
  highlighted: 'bg-primary-50 border-primary-200',
  success: 'bg-green-50 border-green-200',
  danger: 'bg-red-50 border-red-200',
};

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        rounded-lg shadow-md border
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'transition-shadow hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
