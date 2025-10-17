import React, { useState } from 'react';
import { User, Settings, Film, Star, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockMovies, allGenres } from '../data/movies';
import { defaultCriteriaWeights } from '../data/users';
import { Button } from '../components/Button';
import { Slider } from '../components/Slider';
import { StarRating } from '../components/StarRating';
import { CriteriaWeights } from '../types';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const toast = useToast();
  const { user, updateFavoriteGenres, updateDefaultWeights, updateDefaultTargetDuration } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.favoriteGenres || []);
  const [weights, setWeights] = useState<CriteriaWeights>(
    user?.defaultCriteriaWeights || defaultCriteriaWeights
  );
  const [useTarget, setUseTarget] = useState<boolean>(user?.defaultTargetDuration != null);
  const [localTarget, setLocalTarget] = useState<number>(user?.defaultTargetDuration ?? 120);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Por favor inicia sesión para ver tu perfil</p>
      </div>
    );
  }

  const ratedMovies = mockMovies.filter(movie =>
    user.ratings.some(r => r.movieId === movie.id)
  ).map(movie => ({
    ...movie,
    userRating: user.ratings.find(r => r.movieId === movie.id)!.rating
  }));

  const handleGenreToggle = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updated);
  };

  const handleSaveGenres = () => {
    updateFavoriteGenres(selectedGenres);
    toast.success('Géneros favoritos actualizados');
  };

  const handleWeightChange = (criterion: keyof CriteriaWeights, value: number) => {
    setWeights(prev => ({ ...prev, [criterion]: value }));
  };

  const handleSaveWeights = () => {
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const normalized: CriteriaWeights = total > 0 ? {
      rating: Math.round((weights.rating / total) * 100),
      duration: Math.round((weights.duration / total) * 100),
      genre: Math.round((weights.genre / total) * 100),
      director: Math.round((weights.director / total) * 100),
      cast: Math.round((weights.cast / total) * 100),
    } : weights;
    const sum = Object.values(normalized).reduce((s, w) => s + w, 0);
    if (sum !== 100) {
      normalized.rating += (100 - sum);
    }
    updateDefaultWeights(normalized);
    updateDefaultTargetDuration(useTarget ? localTarget : undefined);
    toast.success('Configuración de criterios guardada');
  };

  const handleResetWeights = () => {
    setWeights(defaultCriteriaWeights);
  };

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-primary-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{user.name}</h1>
            <p className="text-gray-600 dark:text-slate-400">{user.email}</p>
            {user.isAnonymous && (
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                Usuario Invitado
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Film className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Películas Calificadas</span>
            </div>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{user.ratings.length}</p>
          </div>

          <div className="bg-primary-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Calificación Promedio</span>
            </div>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {user.ratings.length > 0
                ? (user.ratings.reduce((sum, r) => sum + r.rating, 0) / user.ratings.length).toFixed(1)
                : '0.0'}
            </p>
          </div>

          <div className="bg-primary-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Géneros Favoritos</span>
            </div>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{selectedGenres.length}</p>
          </div>
        </div>
      </div>

      {ratedMovies.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Mis Calificaciones</h2>
          <div className="space-y-4">
            {ratedMovies.map(movie => (
              <div key={movie.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex-1">
                  <Link to={`/movie/${movie.id}`} className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    {movie.title}
                  </Link>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600 dark:text-slate-400">
                    <span>{movie.releaseYear}</span>
                    <span>•</span>
                    <span>{movie.genres.join(', ')}</span>
                  </div>
                </div>
                <StarRating rating={movie.userRating} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">Géneros Favoritos</h2>
        <p className="text-gray-600 dark:text-slate-400 mb-4">
          Selecciona tus géneros favoritos para recibir mejores recomendaciones
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedGenres.includes(genre)
                  ? 'bg-primary-600 text-white hover:bg-primary-500'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <Button onClick={handleSaveGenres}>Guardar Géneros</Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6">
          Configuración de Criterios por Defecto
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-6">
          Establece los pesos predeterminados para tus comparaciones futuras
        </p>

        <div className="bg-primary-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-slate-300">
            Ajusta la importancia de cada criterio según tus preferencias. Los pesos se normalizarán automáticamente.
          </p>
        </div>

        <div className="space-y-6 mb-6">
          <Slider
            label="Calificación"
            value={weights.rating}
            onChange={(value) => handleWeightChange('rating', value)}
            description="Importancia de la calificación general de la película"
          />

          <Slider
            label="Duración"
            value={weights.duration}
            onChange={(value) => handleWeightChange('duration', value)}
            description="Preferencia por películas más cortas o más largas"
          />

          <Slider
            label="Género"
            value={weights.genre}
            onChange={(value) => handleWeightChange('genre', value)}
            description="Coincidencia con tus géneros favoritos"
          />

          <Slider
            label="Director"
            value={weights.director}
            onChange={(value) => handleWeightChange('director', value)}
            description="Importancia del director de la película"
          />

          <Slider
            label="Reparto"
            value={weights.cast}
            onChange={(value) => handleWeightChange('cast', value)}
            description="Importancia de los actores principales"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg mb-6">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Total de pesos:</span>
          <span className={`text-lg font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-primary-600 dark:text-primary-400'}`}>
            {totalWeight}%
          </span>
        </div>

        <div className="space-y-3 p-4 rounded-lg border border-gray-200 dark:border-slate-800 mb-6">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-800 dark:text-slate-100">Usar duración objetivo</label>
            <input type="checkbox" checked={useTarget} onChange={(e) => setUseTarget(e.target.checked)} />
          </div>

          {useTarget && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-slate-200 mb-1">Duración objetivo (min)</label>
                <input
                  type="number"
                  min={60}
                  max={240}
                  step={5}
                  value={localTarget}
                  onChange={(e) => setLocalTarget(Math.max(0, Number(e.target.value)))}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <Slider
                  label={`Objetivo: ${localTarget} min`}
                  value={localTarget}
                  onChange={setLocalTarget}
                  min={60}
                  max={240}
                  description="Las películas cercanas a este valor puntuarán más alto en Duración"
                />
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Nota: si la duración objetivo está desactivada, se usará el método anterior (más corta = mejor).
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleResetWeights} variant="secondary" className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer</span>
          </Button>
          <Button onClick={handleSaveWeights} fullWidth>
            Guardar Configuración
          </Button>
        </div>
      </div>
    </div>
  );
};
