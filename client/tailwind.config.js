/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0b',
        primary: '#3b82f6',
        secondary: '#a855f7',
        accent: '#22c55e',
        neon: {
          blue: '#00f2ff',
          purple: '#bc13fe',
          pink: '#ff0080',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00f2ff, 0 0 20px #00f2ff',
        'neon-purple': '0 0 10px #bc13fe, 0 0 20px #bc13fe',
      }
    },
  },
  plugins: [],
}
