import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Film, Home, BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Film className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">WatchIt</span>
              </Link>

              {user && (
                <div className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                  >
                    <Home className="w-5 h-5" />
                    <span>Inicio</span>
                  </Link>
                  <Link
                    to="/compare"
                    className="flex items-center space-x-2 text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Comparar</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                  >
                    <User className="w-5 h-5" />
                    <span>Perfil</span>
                  </Link>
                </div>
              )}
            </div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {user.isAnonymous ? 'Usuario invitado' : user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800/60 rounded-lg transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
