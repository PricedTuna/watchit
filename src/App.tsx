import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { ComparePage } from './pages/ComparePage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ComparisonHistoryPage } from './pages/ComparisonHistoryPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="movie/:id" element={
          <ProtectedRoute>
            <MovieDetailPage />
          </ProtectedRoute>
        } />
        <Route path="compare" element={
          <ProtectedRoute>
            <ComparisonHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="compare/start" element={
          <ProtectedRoute>
            <ComparePage />
          </ProtectedRoute>
        } />
        <Route path="results" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ComparisonProvider>
          <AppRoutes />
        </ComparisonProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
