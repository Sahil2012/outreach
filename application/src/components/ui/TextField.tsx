import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  helperText,
  error = false,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`
            block rounded-lg border px-3 py-2 shadow-sm transition-all duration-200 
            focus:ring-2 focus:outline-none
            ${icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/30'}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {helperText && (
        <p
          className={`mt-1 text-sm ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;