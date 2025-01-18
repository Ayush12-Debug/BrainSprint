/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2'
        },
        secondary: {
          DEFAULT: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00'
        },
        accent: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C'
        },
        background: {
          DEFAULT: '#F5F5F5',
          paper: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
};