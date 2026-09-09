/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#FAF9F6',
          dark: '#0B0B0C',
        },
        card: {
          light: '#FFFFFF',
          dark: '#151517',
        },
        accent: {
          DEFAULT: '#1F6F54', // verde patrimônio, usado com moderação
          soft: '#DCEFE7',
        },
        warn: '#B45309',
        danger: '#B3261E',
        muted: '#8A8A8E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
