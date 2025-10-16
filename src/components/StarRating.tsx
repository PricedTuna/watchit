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
        const isFilled = fillPercentage > 0;

        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition' : 'cursor-default'}`}
            type="button"
          >
            <Star
              className={`${sizeMap[size]} ${isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              style={{
                clipPath: fillPercentage < 1 ? `inset(0 ${(1 - fillPercentage) * 100}% 0 0)` : undefined
              }}
            />
            {fillPercentage > 0 && fillPercentage < 1 && (
              <Star
                className={`${sizeMap[size]} text-gray-300 absolute top-0 left-0`}
                style={{
                  clipPath: `inset(0 0 0 ${fillPercentage * 100}%)`
                }}
              />
            )}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
