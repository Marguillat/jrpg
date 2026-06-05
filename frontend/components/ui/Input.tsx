import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full font-sans">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-[#393E41]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`px-4 py-2.5 rounded-lg bg-[#f2eeee]/80 border border-transparent border-b-[#e5e0e0] text-[#393E41] placeholder-[#737971] focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-150 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-600 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
