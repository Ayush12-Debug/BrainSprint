import React from 'react';
import { useTestStore } from '../stores/testStore';
import { Focus } from 'lucide-react';

export default function ZenMode() {
  const { zenMode, setZenMode } = useTestStore();

  const toggleZenMode = () => {
    if (!zenMode) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setZenMode(!zenMode);
  };

  return (
    <button
      onClick={toggleZenMode}
      className={`fixed bottom-4 right-4 flex items-center space-x-2 px-4 py-2 rounded-md ${
        zenMode 
          ? 'bg-indigo-600 text-white' 
          : 'bg-white text-gray-700 border border-gray-200'
      }`}
    >
      <Focus className="h-5 w-5" />
      <span>{zenMode ? 'Exit Zen Mode' : 'Enter Zen Mode'}</span>
    </button>
  );
}