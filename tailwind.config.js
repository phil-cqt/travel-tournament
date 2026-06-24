/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        cosmos: {
          950: '#05050f',
          900: '#0d0d1f',
          800: '#14142e',
          700: '#1e1e42',
          600: '#2a2a58',
        },
      },
      animation: {
        'pulse-gold': 'pulseGold 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251,191,36,0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(251,191,36,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
