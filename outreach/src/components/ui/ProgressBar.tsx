import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps,
  labels = ['Template', 'Details', 'Preview', 'Send'] 
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div 
              className={`
                flex items-center justify-center w-8 h-8 rounded-full mb-1
                ${index + 1 < currentStep ? 'bg-blue-600 text-white' : ''}
                ${index + 1 === currentStep ? 'bg-white border-2 border-blue-600 text-blue-600' : ''}
                ${index + 1 > currentStep ? 'bg-white border-2 border-gray-300 text-gray-400' : ''}
              `}
            >
              {index + 1 < currentStep ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs font-medium">{labels[index]}</span>
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
          <div 
            style={{ width: `${(currentStep - 1) / (totalSteps - 1) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500 ease-in-out"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;