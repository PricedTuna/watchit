import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, Settings } from 'lucide-react';
import { mockMovies } from '../data/movies';
import { useComparison } from '../context/ComparisonContext';
import { MovieCard } from '../components/MovieCard';
import { Button } from '../components/Button';
import { CriteriaModal } from '../components/CriteriaModal';

export const ComparePage: React.FC = () => {
  const { selectedMovies, addMovie, removeMovie, clearSelection } = useComparison();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredMovies = mockMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMovieToggle = (movie: typeof mockMovies[0]) => {
    const isSelected = selectedMovies.some(m => m.id === movie.id);
    if (isSelected) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  };

  const handleOpenCriteria = () => {
    if (selectedMovies.length < 2) {
      alert('Por favor selecciona al menos 2 películas para comparar');
      return;
    }
    setIsCriteriaModalOpen(true);
  };

  const handleComparisionComplete = () => {
    setIsCriteriaModalOpen(false);
    navigate('/results');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">
          Comparar Películas
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mb-6">
          Selecciona las películas que deseas comparar y configura los criterios de evaluación
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título o género..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {selectedMovies.length > 0 && (
          <div className="mt-6 p-4 bg-primary-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                Películas Seleccionadas: {selectedMovies.length}
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={clearSelection}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpiar</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMovies.map(movie => (
                <span
                  key={movie.id}
                  className="px-3 py-1 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-full text-sm font-medium flex items-center space-x-2 border border-primary-200 dark:border-slate-700"
                >
                  <span>{movie.title}</span>
                  <button
                    onClick={() => removeMovie(movie.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4">
              <Button
                onClick={handleOpenCriteria}
                disabled={selectedMovies.length < 2}
                className="flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Configurar Criterios y Comparar</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={handleMovieToggle}
            isSelected={selectedMovies.some(m => m.id === movie.id)}
            showCheckbox
          />
        ))}
      </div>

      <CriteriaModal
        isOpen={isCriteriaModalOpen}
        onClose={() => setIsCriteriaModalOpen(false)}
        onComplete={handleComparisionComplete}
      />
    </div>
  );
};
