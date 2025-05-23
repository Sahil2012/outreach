import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  helperText,
  error = false,
  fullWidth = false,
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
      <textarea
        className={`
          block rounded-lg border px-3 py-2 shadow-sm transition-all duration-200
          focus:ring-2 focus:outline-none
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/30'}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      />
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

export default TextArea;