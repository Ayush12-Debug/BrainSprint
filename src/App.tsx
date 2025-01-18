import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Tests from './pages/Tests';
import TestDetails from './pages/TestDetails';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import { useAuthStore } from './stores/authStore';

export default function App() {
  const { session } = useAuthStore();

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background pb-16 sm:pb-0">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/tests/:id" element={<TestDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}