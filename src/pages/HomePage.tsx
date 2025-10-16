import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockMovies } from '../data/movies';
import { getRecommendations, getGenericRecommendations } from '../utils/comparison';
import { MovieCard } from '../components/MovieCard';
import { Button } from '../components/Button';

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const recommendations = user && !user.isAnonymous && user.ratings.length > 0
    ? getRecommendations(mockMovies, user.ratings, user.favoriteGenres, 8)
    : getGenericRecommendations(mockMovies, 8);

  const popularMovies = getGenericRecommendations(mockMovies, 12);

  return (
    <div className="space-y-12">
      <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4">
            Bienvenido a WatchIt
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-6">
            Descubre y compara películas usando nuestro sistema de recomendación inteligente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/compare">
              <Button size="lg" className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Comparar Películas</span>
              </Button>
            </Link>
            {user && (
              <Link to="/profile">
                <Button variant="outline" size="lg">
                  Ver Mi Perfil
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              {user && !user.isAnonymous && user.ratings.length > 0
                ? 'Recomendaciones Personalizadas'
                : 'Recomendaciones Populares'}
            </h2>
          </div>
        </div>
        {user && !user.isAnonymous && user.ratings.length > 0 ? (
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Basadas en tus calificaciones y preferencias
          </p>
        ) : (
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Las películas mejor calificadas
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
          Películas Populares
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};
