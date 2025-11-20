import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'danger';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variants = {
    default: 'bg-white',
    success: 'bg-green-50 border-green-200',
    danger: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`rounded-lg shadow p-6 border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
