import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAdminStore } from '../stores/adminStore';

export default function Navbar() {
  const { signOut } = useAuthStore();
  const { isAdmin } = useAdminStore();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/brain-sprint-icon.svg" alt="BrainSprint" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">BrainSprint</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/tests" className="text-gray-700 hover:text-primary">
              Tests
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-primary">
              Profile
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-primary">
                <Shield className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            <button
              onClick={signOut}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}