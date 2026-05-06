/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'volt': {
          300: '#d4ff33',
          400: '#c8f500',
          500: '#a8cc00',
        },
        'ink': {
          50:  '#e0e0eb',
          100: '#c2c2d6',
          200: '#9999b8',
          300: '#7070a0',
          400: '#555580',
          500: '#3d3d66',
          600: '#2d2d62',
          700: '#1f1f48',
          800: '#14142e',
          900: '#0a0a1a',
        },
        'teal':  '#00d4aa',
        'amber': '#f59e0b',
        'coral': '#ff6b6b',
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        sans:    ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up':  'fade-up 0.3s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
