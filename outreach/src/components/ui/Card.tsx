import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  selected?: boolean;
  isActive? : boolean,
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  isActive = false,
  selected = false,
  onClick
}) => {
  return (
    <div 
      className={`
        rounded-xl shadow-sm border border-gray-200
        ${isActive ? 'bg-white' : 'bg-[#E5E7EB]'}
        ${hoverable ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-blue-200' : ''}
        ${selected ? 'ring-2 ring-blue-500 shadow-md border-transparent' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;