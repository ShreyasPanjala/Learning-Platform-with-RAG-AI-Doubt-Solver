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
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#c7ddff',
          300: '#9ec4ff',
          400: '#6d9eff',
          500: '#4674ff',
          600: '#2b52f5',
          700: '#1e3ce2',
          800: '#1e33b7',
          900: '#1e2f90',
          950: '#141d57',
        },
        accent: {
          cyan: '#00f2fe',
          purple: '#7928ca',
          pink: '#ff0080',
          emerald: '#10b981',
        },
        dark: {
          bg: '#090d16',
          card: '#111827',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(70, 116, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #090d16 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(70, 116, 255, 0.3)',
        'glow-md': '0 0 30px rgba(70, 116, 255, 0.4)',
        'glow-lg': '0 0 50px rgba(70, 116, 255, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
