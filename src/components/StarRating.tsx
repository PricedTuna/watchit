import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const fillPercentage = Math.max(0, Math.min(1, rating - index));

        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!interactive}
            aria-label={`Calificar con ${index + 1} estrellas`}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            type="button"
          >
            {/* Base star (outline) */}
            <Star
              className={`${sizeMap[size]} text-gray-300 dark:text-gray-500`}
              strokeWidth={2}
              fill="none"
            />
            {/* Filled part overlay */}
            {fillPercentage > 0 && (
              <Star
                className={`${sizeMap[size]} absolute top-0 left-0 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] hover:text-yellow-400 dark:hover:text-yellow-300 ${interactive ? 'transition-colors' : ''}`}
                strokeWidth={2}
                // give the filled star a darker stroke for better contrast
                // Tailwind stroke color utility
                stroke="currentColor"
                // fill with current color so it actually paints the inside
                fill="currentColor"
                style={{
                  clipPath: `inset(0 ${(1 - fillPercentage) * 100}% 0 0)`
                }}
              />
            )}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
