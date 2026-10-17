/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#E8F3FB', 100: '#CCE4F5', 200: '#99C9EB', 500: '#0070C0', 600: '#005FA3', 700: '#004C82', 900: '#0B2540' },
      },
      fontFamily: { sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif'] },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(0.6)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
      },
      animation: { fadeIn: 'fadeIn 250ms ease-out', pop: 'pop 250ms ease-out' },
    },
  },
  plugins: [],
};
