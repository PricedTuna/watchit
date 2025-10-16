export interface Movie {
  id: number;
  title: string;
  duration: number;
  genres: string[];
  director: string;
  cast: string[];
  synopsis: string;
  rating: number;
  posterUrl: string;
  releaseYear: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAnonymous: boolean;
  ratings: UserRating[];
  favoriteGenres: string[];
  defaultCriteriaWeights: CriteriaWeights;
}

export interface UserRating {
  movieId: number;
  rating: number;
  timestamp: number;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
}

export interface CriteriaWeights {
  rating: number;
  duration: number;
  genre: number;
  director: number;
  cast: number;
}

export interface ComparisonResult {
  movie: Movie;
  totalScore: number;
  criteriaScores: {
    rating: number;
    duration: number;
    genre: number;
    director: number;
    cast: number;
  };
  normalizedValues: {
    rating: number;
    duration: number;
    genre: number;
    director: number;
    cast: number;
  };
}
