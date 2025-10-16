import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, Users, ArrowLeft, Star } from 'lucide-react';
import { mockMovies } from '../data/movies';
import { useAuth } from '../context/AuthContext';
import { useComparison } from '../context/ComparisonContext';
import { StarRating } from '../components/StarRating';
import { Button } from '../components/Button';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, addRating } = useAuth();
  const { addMovie, selectedMovies } = useComparison();
  const movie = mockMovies.find(m => m.id === Number(id));

  const [userRating, setUserRating] = useState<number>(
    user?.ratings.find(r => r.movieId === Number(id))?.rating || 0
  );

  if (!movie) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Película no encontrada</h2>
        <Link to="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    addRating(movie.id, rating);
  };

  const handleAddToComparison = () => {
    addMovie(movie);
  };

  const isInComparison = selectedMovies.some(m => m.id === movie.id);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al inicio</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-800">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gray-200 dark:bg-slate-800">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-2/3 p-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <span className="text-gray-700 dark:text-slate-300">{movie.releaseYear}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <span className="text-gray-700 dark:text-slate-300">{movie.duration} min</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-700 dark:bg-slate-800 dark:text-primary-300 dark:border dark:border-slate-700 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Calificación General</span>
              </h3>
              <StarRating rating={movie.rating} />
            </div>

            {user && (
              <div className="mb-6 p-4 bg-primary-50 dark:bg-slate-800 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Tu Calificación
                </h3>
                <StarRating
                  rating={userRating}
                  interactive
                  onChange={handleRatingChange}
                  size="lg"
                />
                {userRating > 0 && (
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">
                    Has calificado esta película con {userRating} estrellas
                  </p>
                )}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Director</span>
              </h3>
              <p className="text-gray-700 dark:text-slate-300">{movie.director}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Reparto Principal</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map(actor => (
                  <span
                    key={actor}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded border border-gray-200 dark:border-slate-700"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Sinopsis</h3>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{movie.synopsis}</p>
            </div>

            <div className="flex gap-4">
              <Link to="/compare">
                <Button
                  onClick={handleAddToComparison}
                  disabled={isInComparison}
                >
                  {isInComparison ? 'Ya está en comparación' : 'Agregar a comparación'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
