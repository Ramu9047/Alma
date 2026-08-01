import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className="relative p-2 rounded-lg text-text-lo hover:text-accent-2 hover:bg-surface-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-2"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun
          className={`absolute w-5 h-5 transition-all duration-200 transform ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 text-amber-500'
          }`}
        />
        <Moon
          className={`absolute w-5 h-5 transition-all duration-200 transform ${
            isDark ? 'opacity-100 rotate-0 scale-100 text-accent-2' : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
      </div>
    </button>
  );
}
