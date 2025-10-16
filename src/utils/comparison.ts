import { Movie, CriteriaWeights, ComparisonResult } from '../types';

export const normalizeValue = (
  value: number,
  min: number,
  max: number,
  higherIsBetter: boolean = true
): number => {
  if (max === min) return 1;
  const normalized = (value - min) / (max - min);
  return higherIsBetter ? normalized : 1 - normalized;
};

export const calculateGenreMatch = (
  movieGenres: string[],
  userFavorites: string[]
): number => {
  if (userFavorites.length === 0) return 0.5;
  const matches = movieGenres.filter(g => userFavorites.includes(g)).length;
  return matches / Math.max(movieGenres.length, userFavorites.length);
};

export const calculateDirectorScore = (
  director: string,
  topDirectors: string[]
): number => {
  if (topDirectors.length === 0) return 0.5;
  const index = topDirectors.indexOf(director);
  if (index === -1) return 0.3;
  return 1 - (index / topDirectors.length) * 0.7;
};

export const calculateCastScore = (
  cast: string[],
  topActors: string[]
): number => {
  if (topActors.length === 0) return 0.5;
  const matches = cast.filter(actor => topActors.includes(actor)).length;
  return Math.min(matches / 3, 1);
};

export const compareMovies = (
  movies: Movie[],
  weights: CriteriaWeights,
  userFavoriteGenres: string[] = [],
  userTopDirectors: string[] = [],
  userTopActors: string[] = []
): ComparisonResult[] => {
  if (movies.length === 0) return [];

  const ratings = movies.map(m => m.rating);
  const durations = movies.map(m => m.duration);

  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const minDuration = Math.min(...durations);
  const maxDuration = Math.max(...durations);

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const normalizedWeights = {
    rating: weights.rating / totalWeight,
    duration: weights.duration / totalWeight,
    genre: weights.genre / totalWeight,
    director: weights.director / totalWeight,
    cast: weights.cast / totalWeight,
  };

  const results: ComparisonResult[] = movies.map(movie => {
    const normalizedRating = normalizeValue(movie.rating, minRating, maxRating, true);
    const normalizedDuration = normalizeValue(movie.duration, minDuration, maxDuration, false);
    const normalizedGenre = calculateGenreMatch(movie.genres, userFavoriteGenres);
    const normalizedDirector = calculateDirectorScore(movie.director, userTopDirectors);
    const normalizedCast = calculateCastScore(movie.cast, userTopActors);

    const criteriaScores = {
      rating: normalizedWeights.rating * normalizedRating,
      duration: normalizedWeights.duration * normalizedDuration,
      genre: normalizedWeights.genre * normalizedGenre,
      director: normalizedWeights.director * normalizedDirector,
      cast: normalizedWeights.cast * normalizedCast,
    };

    const totalScore = Object.values(criteriaScores).reduce((sum, score) => sum + score, 0);

    return {
      movie,
      totalScore,
      criteriaScores,
      normalizedValues: {
        rating: normalizedRating,
        duration: normalizedDuration,
        genre: normalizedGenre,
        director: normalizedDirector,
        cast: normalizedCast,
      }
    };
  });

  return results.sort((a, b) => b.totalScore - a.totalScore);
};

export const getRecommendations = (
  allMovies: Movie[],
  ratedMovies: { movieId: number; rating: number }[],
  favoriteGenres: string[],
  limit: number = 10
): Movie[] => {
  const ratedMovieIds = new Set(ratedMovies.map(r => r.movieId));
  const unratedMovies = allMovies.filter(m => !ratedMovieIds.has(m.id));

  const scored = unratedMovies.map(movie => {
    let score = movie.rating * 10;

    if (favoriteGenres.length > 0) {
      const genreMatch = movie.genres.filter(g => favoriteGenres.includes(g)).length;
      score += genreMatch * 15;
    }

    return { movie, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.movie);
};

export const getGenericRecommendations = (
  allMovies: Movie[],
  limit: number = 10
): Movie[] => {
  return [...allMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
