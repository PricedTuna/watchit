import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Movie, CriteriaWeights, ComparisonResult } from '../types';
import { defaultCriteriaWeights } from '../data/users';

interface ComparisonContextType {
  selectedMovies: Movie[];
  criteriaWeights: CriteriaWeights;
  comparisonResults: ComparisonResult[] | null;
  targetDuration?: number;
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  clearSelection: () => void;
  setCriteriaWeights: (weights: CriteriaWeights) => void;
  setComparisonResults: (results: ComparisonResult[]) => void;
  setTargetDuration: (minutes: number | undefined) => void;
  resetComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [criteriaWeights, setCriteriaWeightsState] = useState<CriteriaWeights>({ ...defaultCriteriaWeights });
  const [comparisonResults, setComparisonResultsState] = useState<ComparisonResult[] | null>(null);
  const [targetDuration, setTargetDurationState] = useState<number | undefined>(undefined);

  const addMovie = (movie: Movie) => {
    if (!selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const removeMovie = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
  };

  const clearSelection = () => {
    setSelectedMovies([]);
  };

  const setCriteriaWeights = (weights: CriteriaWeights) => {
    setCriteriaWeightsState(weights);
  };

  const setComparisonResults = (results: ComparisonResult[]) => {
    setComparisonResultsState(results);
  };

  const setTargetDuration = (minutes: number | undefined) => {
    setTargetDurationState(minutes);
  };

  const resetComparison = () => {
    setSelectedMovies([]);
    setCriteriaWeightsState({ ...defaultCriteriaWeights });
    setComparisonResultsState(null);
    setTargetDurationState(undefined);
  };

  return (
    <ComparisonContext.Provider value={{
      selectedMovies,
      criteriaWeights,
      comparisonResults,
      targetDuration,
      addMovie,
      removeMovie,
      clearSelection,
      setCriteriaWeights,
      setComparisonResults,
      setTargetDuration,
      resetComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
