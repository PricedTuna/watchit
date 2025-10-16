import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRating } from '../types';
import { mockUsers, defaultCriteriaWeights } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  loginAnonymous: () => void;
  logout: () => void;
  addRating: (movieId: number, rating: number) => void;
  updateFavoriteGenres: (genres: string[]) => void;
  updateDefaultWeights: (weights: typeof defaultCriteriaWeights) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('watchit_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, _password: string) => {
    const existingUser = mockUsers.find(u => u.email === email);
    const loggedInUser = existingUser || {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      isAnonymous: false,
      ratings: [],
      favoriteGenres: [],
      defaultCriteriaWeights: { ...defaultCriteriaWeights }
    };
    setUser(loggedInUser);
    localStorage.setItem('watchit_user', JSON.stringify(loggedInUser));
  };

  const loginAnonymous = () => {
    const anonymousUser: User = {
      id: `anon-${Date.now()}`,
      email: 'anonymous@watchit.com',
      name: 'Guest User',
      isAnonymous: true,
      ratings: [],
      favoriteGenres: [],
      defaultCriteriaWeights: { ...defaultCriteriaWeights }
    };
    setUser(anonymousUser);
    localStorage.setItem('watchit_user', JSON.stringify(anonymousUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('watchit_user');
  };

  const addRating = (movieId: number, rating: number) => {
    if (!user) return;

    const existingRatingIndex = user.ratings.findIndex(r => r.movieId === movieId);
    const updatedRatings = [...user.ratings];

    if (existingRatingIndex >= 0) {
      updatedRatings[existingRatingIndex] = { movieId, rating, timestamp: Date.now() };
    } else {
      updatedRatings.push({ movieId, rating, timestamp: Date.now() });
    }

    const updatedUser = { ...user, ratings: updatedRatings };
    setUser(updatedUser);
    localStorage.setItem('watchit_user', JSON.stringify(updatedUser));
  };

  const updateFavoriteGenres = (genres: string[]) => {
    if (!user) return;
    const updatedUser = { ...user, favoriteGenres: genres };
    setUser(updatedUser);
    localStorage.setItem('watchit_user', JSON.stringify(updatedUser));
  };

  const updateDefaultWeights = (weights: typeof defaultCriteriaWeights) => {
    if (!user) return;
    const updatedUser = { ...user, defaultCriteriaWeights: weights };
    setUser(updatedUser);
    localStorage.setItem('watchit_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginAnonymous,
      logout,
      addRating,
      updateFavoriteGenres,
      updateDefaultWeights
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
