import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    isAnonymous: false,
    ratings: [
      { movieId: 1, rating: 5, timestamp: Date.now() - 86400000 },
      { movieId: 3, rating: 4.5, timestamp: Date.now() - 172800000 },
      { movieId: 8, rating: 5, timestamp: Date.now() - 259200000 },
    ],
    favoriteGenres: ['Sci-Fi', 'Action', 'Drama'],
    defaultCriteriaWeights: {
      rating: 30,
      duration: 15,
      genre: 25,
      director: 20,
      cast: 10,
    }
  },
  {
    id: 'user-2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    isAnonymous: false,
    ratings: [
      { movieId: 4, rating: 5, timestamp: Date.now() - 86400000 },
      { movieId: 7, rating: 4, timestamp: Date.now() - 172800000 },
    ],
    favoriteGenres: ['Crime', 'Drama', 'Thriller'],
    defaultCriteriaWeights: {
      rating: 40,
      duration: 10,
      genre: 20,
      director: 20,
      cast: 10,
    }
  }
];

export const defaultCriteriaWeights = {
  rating: 30,
  duration: 15,
  genre: 25,
  director: 20,
  cast: 10,
};
