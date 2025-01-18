import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, TrendingUp, BookMarked, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden">
      <div className="grid grid-cols-5 h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center ${
            isActive('/') ? 'text-primary' : 'text-gray-600'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/tests"
          className={`flex flex-col items-center justify-center ${
            isActive('/tests') ? 'text-primary' : 'text-gray-600'
          }`}
        >
          <BookOpen className="h-6 w-6" />
          <span className="text-xs mt-1">Tests</span>
        </Link>
        <Link
          to="/progress"
          className={`flex flex-col items-center justify-center ${
            isActive('/progress') ? 'text-primary' : 'text-gray-600'
          }`}
        >
          <TrendingUp className="h-6 w-6" />
          <span className="text-xs mt-1">Progress</span>
        </Link>
        <Link
          to="/resources"
          className={`flex flex-col items-center justify-center ${
            isActive('/resources') ? 'text-primary' : 'text-gray-600'
          }`}
        >
          <BookMarked className="h-6 w-6" />
          <span className="text-xs mt-1">Resources</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center ${
            isActive('/profile') ? 'text-primary' : 'text-gray-600'
          }`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}