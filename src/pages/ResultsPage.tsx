import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useAuth } from '../context/AuthContext';
import { compareMovies } from '../utils/comparison';
import { Button } from '../components/Button';
import { StarRating } from '../components/StarRating';

export const ResultsPage: React.FC = () => {
  const { selectedMovies, criteriaWeights, comparisonResults, setComparisonResults, resetComparison, targetDuration } = useComparison();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;
  const providedResults = state?.comparisonResults as any[] | undefined;

  useEffect(() => {
    // If results are provided from history, prefer them and skip recalculation/redirects
    if (providedResults) {
      if (!comparisonResults || comparisonResults.length === 0) {
        setComparisonResults(providedResults as any);
      }
      return;
    }

    if (selectedMovies.length < 2) {
      // If no provided results, go back to the comparison entry (history)
      navigate('/compare');
      return;
    }

    if (!comparisonResults) {
      const topDirectors = user?.ratings
        .map(r => selectedMovies.find(m => m.id === r.movieId)?.director)
        .filter(Boolean) as string[];

      const topActors = user?.ratings
        .flatMap(r => selectedMovies.find(m => m.id === r.movieId)?.cast || [])
        .slice(0, 5);

      const results = compareMovies(
        selectedMovies,
        criteriaWeights,
        user?.favoriteGenres || [],
        topDirectors,
        topActors,
        targetDuration,
        60
      );

      setComparisonResults(results);
    }
  }, [selectedMovies, criteriaWeights, user, comparisonResults, setComparisonResults, navigate, providedResults]);

  if (!comparisonResults || comparisonResults.length === 0) {
    return <div className="text-center py-12">Calculando resultados...</div>;
  }

  const winner = comparisonResults[0];

  const compatibilityData = comparisonResults.map(result => ({
    name: result.movie.title.length > 20 ? result.movie.title.substring(0, 20) + '...' : result.movie.title,
    compatibility: Math.round(result.totalScore * 100)
  }));

  const criteriaData = comparisonResults.map(result => ({
    name: result.movie.title.length > 15 ? result.movie.title.substring(0, 15) + '...' : result.movie.title,
    rating: Math.round(result.criteriaScores.rating * 100),
    duration: Math.round(result.criteriaScores.duration * 100),
    genre: Math.round(result.criteriaScores.genre * 100),
    director: Math.round(result.criteriaScores.director * 100),
    cast: Math.round(result.criteriaScores.cast * 100),
  }));

  const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'];

  const handleNewComparison = () => {
    resetComparison();
    navigate('/compare/start');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/compare"
          className="inline-flex items-center space-x-2 text-sky-500 hover:text-sky-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a comparación</span>
        </Link>
        <Button onClick={handleNewComparison} variant="secondary" className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>Nueva Comparación</span>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-sky-200">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Película Recomendada
        </h1>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-sky-600 mb-4">{winner.movie.title}</h2>
          <div className="flex items-center justify-center mb-4">
            <StarRating rating={winner.movie.rating} size="lg" />
          </div>
          <div className="inline-block px-6 py-3 bg-sky-100 rounded-full">
            <span className="text-2xl font-bold text-sky-700">
              {Math.round(winner.totalScore * 100)}% de Compatibilidad
            </span>
          </div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{winner.movie.synopsis}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Compatibilidad General
        </h2>
        {targetDuration != null && (
          <div className="text-sm text-gray-600 mb-4">
            Duración objetivo activa: <span className="font-medium">{targetDuration} min</span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={compatibilityData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="compatibility" name="Compatibilidad" radius={[0, 8, 8, 0]}>
              {compatibilityData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Puntuación ponderada total basada en tus criterios configurados
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Contribución por Criterio
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={criteriaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rating" name="Calificación" stackId="a" fill="#0ea5e9" />
            <Bar dataKey="duration" name="Duración" stackId="a" fill="#38bdf8" />
            <Bar dataKey="genre" name="Género" stackId="a" fill="#7dd3fc" />
            <Bar dataKey="director" name="Director" stackId="a" fill="#bae6fd" />
            <Bar dataKey="cast" name="Reparto" stackId="a" fill="#e0f2fe" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Desglose de puntuación por cada criterio de evaluación
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Ranking Detallado
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Posición</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Película</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Puntuación Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Calificación</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Duración</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Género</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Director</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Reparto</th>
              </tr>
            </thead>
            <tbody>
              {comparisonResults.map((result, index) => (
                <tr
                  key={result.movie.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${index === 0 ? 'bg-sky-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      <span className="font-bold text-gray-900">{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/movie/${result.movie.id}`} className="font-medium text-sky-600 hover:text-sky-700">
                      {result.movie.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-sky-600">
                      {Math.round(result.totalScore * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {Math.round(result.criteriaScores.rating * 100)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {Math.round(result.criteriaScores.duration * 100)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {Math.round(result.criteriaScores.genre * 100)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {Math.round(result.criteriaScores.director * 100)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {Math.round(result.criteriaScores.cast * 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-sky-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">¿Cómo se calculan estos resultados?</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          Los resultados se calculan utilizando el método WSM (Weighted Sum Model). Cada película se evalúa
          según los criterios que configuraste, asignando valores normalizados de 0 a 1 para cada aspecto.
          Luego, estos valores se multiplican por los pesos que asignaste a cada criterio, y se suman para
          obtener una puntuación total. La película con la puntuación más alta es la más compatible con tus preferencias.
        </p>
        {targetDuration != null && (
          <p className="text-xs text-gray-600 mt-2">
            Nota: para el criterio Duración, se usa proximidad a un objetivo de {targetDuration} min (las películas más cercanas puntúan más alto).
          </p>
        )}
      </div>
    </div>
  );
};
