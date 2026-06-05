import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
}

export function Card({ children, accent = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card-bg rounded-2xl border border-card-border p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
        accent ? 'border-t-4 border-t-accent' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
