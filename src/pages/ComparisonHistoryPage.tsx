import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { mockMovies } from '../data/movies';

// Helper to get a movie by id
const getMovie = (id: number) => mockMovies.find(m => m.id === id)!;

// Mocked comparison history data
// Each entry includes a prebuilt comparisonResults array compatible with ResultsPage expectations
const mockHistory = [
  {
    id: 'cmp-001',
    date: '2025-10-10 20:15',
    movieIds: [3, 8, 2],
    comparisonResults: [
      {
        movie: getMovie(8),
        totalScore: 0.92,
        criteriaScores: { rating: 0.95, duration: 0.85, genre: 0.9, director: 0.96, cast: 0.88 },
        normalizedValues: { rating: 0.95, duration: 0.85, genre: 0.9, director: 0.96, cast: 0.88 },
      },
      {
        movie: getMovie(3),
        totalScore: 0.88,
        criteriaScores: { rating: 0.9, duration: 0.82, genre: 0.86, director: 0.92, cast: 0.84 },
        normalizedValues: { rating: 0.9, duration: 0.82, genre: 0.86, director: 0.92, cast: 0.84 },
      },
      {
        movie: getMovie(2),
        totalScore: 0.81,
        criteriaScores: { rating: 0.89, duration: 0.78, genre: 0.8, director: 0.85, cast: 0.76 },
        normalizedValues: { rating: 0.89, duration: 0.78, genre: 0.8, director: 0.85, cast: 0.76 },
      },
    ],
  },
  {
    id: 'cmp-002',
    date: '2025-10-12 19:03',
    movieIds: [11, 4],
    comparisonResults: [
      {
        movie: getMovie(11),
        totalScore: 0.93,
        criteriaScores: { rating: 0.97, duration: 0.8, genre: 0.9, director: 0.95, cast: 0.88 },
        normalizedValues: { rating: 0.97, duration: 0.8, genre: 0.9, director: 0.95, cast: 0.88 },
      },
      {
        movie: getMovie(4),
        totalScore: 0.86,
        criteriaScores: { rating: 0.91, duration: 0.79, genre: 0.86, director: 0.88, cast: 0.82 },
        normalizedValues: { rating: 0.91, duration: 0.79, genre: 0.86, director: 0.88, cast: 0.82 },
      },
    ],
  },
  {
    id: 'cmp-003',
    date: '2025-10-15 21:40',
    movieIds: [6, 18, 21],
    comparisonResults: [
      {
        movie: getMovie(6),
        totalScore: 0.9,
        criteriaScores: { rating: 0.92, duration: 0.86, genre: 0.88, director: 0.9, cast: 0.87 },
        normalizedValues: { rating: 0.92, duration: 0.86, genre: 0.88, director: 0.9, cast: 0.87 },
      },
      {
        movie: getMovie(21),
        totalScore: 0.84,
        criteriaScores: { rating: 0.88, duration: 0.8, genre: 0.82, director: 0.84, cast: 0.82 },
        normalizedValues: { rating: 0.88, duration: 0.8, genre: 0.82, director: 0.84, cast: 0.82 },
      },
      {
        movie: getMovie(18),
        totalScore: 0.8,
        criteriaScores: { rating: 0.85, duration: 0.78, genre: 0.8, director: 0.82, cast: 0.79 },
        normalizedValues: { rating: 0.85, duration: 0.78, genre: 0.8, director: 0.82, cast: 0.79 },
      },
    ],
  },
] as const;

export const ComparisonHistoryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOpenComparison = (entry: typeof mockHistory[number]) => {
    // Navigate to the results page with mocked results
    navigate('/results', {
      state: {
        comparisonResults: entry.comparisonResults,
        fromHistory: true,
        historyId: entry.id,
      },
    });
  };

  const handleNewComparison = () => {
    navigate('/compare/start');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial de Comparaciones</h1>
          <p className="text-gray-600">Revisa tus comparaciones anteriores o inicia una nueva</p>
        </div>
        <Button onClick={handleNewComparison} className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nueva comparación</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockHistory.map((entry) => {
          const winner = entry.comparisonResults[0].movie;
          const score = Math.round(entry.comparisonResults[0].totalScore * 100);
          const vsText = entry.comparisonResults
            .map(r => r.movie.title)
            .join(' vs ');

          return (
            <div
              key={entry.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => handleOpenComparison(entry)}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                <div>
                  <div className="text-gray-700 truncate" title={vsText}>{vsText}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <div>
                      <div className="text-sm text-gray-500">Ganadora</div>
                      <div className="font-semibold text-gray-900">{winner.title}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Compatibilidad</div>
                    <div className="text-lg font-bold text-sky-600">{score}%</div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-sky-600 flex items-center justify-end space-x-2">
                <span>Ver resultado</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonHistoryPage;
