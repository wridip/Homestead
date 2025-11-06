/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#1a202c',
        },
        secondary: {
          light: '#f7fafc',
          dark: '#2d3748',
        },
        'text-primary': {
          light: '#1a202c',
          dark: '#e2e8f0',
        },
        'text-secondary': {
          light: '#4a5568',
          dark: '#a0aec0',
        },
      },
    },
  },
  plugins: [],
}