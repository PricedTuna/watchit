import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { Movie } from '../types';
import { StarRating } from './StarRating';

interface MovieCardProps {
  movie: Movie;
  onSelect?: (movie: Movie) => void;
  isSelected?: boolean;
  showCheckbox?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  isSelected = false,
  showCheckbox = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (showCheckbox && onSelect) {
      e.preventDefault();
      onSelect(movie);
    }
  };

  const CardContent = (
    <div
      className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={handleClick}
    >
      {showCheckbox && (
        <div className="absolute top-3 right-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect && onSelect(movie)}
            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
        </div>
      )}

      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
          <StarRating rating={movie.rating} size="sm" />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-400 mb-2">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{movie.releaseYear}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{movie.duration} min</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.genres.slice(0, 3).map(genre => (
            <span
              key={genre}
              className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-slate-800 dark:text-primary-300 dark:border dark:border-slate-700 rounded"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 line-clamp-2">
          {movie.synopsis}
        </p>
      </div>
    </div>
  );

  if (showCheckbox) {
    return CardContent;
  }

  return (
    <Link to={`/movie/${movie.id}`}>
      {CardContent}
    </Link>
  );
};
