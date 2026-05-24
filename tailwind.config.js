/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    // Colores dinámicos de categorías y estados
    'bg-primary', 'bg-primary-dark', 'bg-primary-light',
    'text-primary', 'text-primary-dark',
    'border-primary', 'ring-primary',
    'bg-accent', 'bg-accent-light',
    'text-accent',
    'border-accent',
    // Estados de slots
    'bg-green-100', 'text-green-700', 'border-green-300',
    'bg-yellow-100', 'text-yellow-700', 'border-yellow-300',
    'bg-red-100', 'text-red-700', 'border-red-300',
    'bg-gray-100', 'text-gray-400',
    // Niveles de usuario
    'bg-amber-100', 'text-amber-700',
    'bg-emerald-100', 'text-emerald-700',
    'bg-blue-100', 'text-blue-700',
    'bg-purple-100', 'text-purple-700',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#E8F5E9'
        },
        accent: {
          DEFAULT: '#F57C00',
          light: '#FFF3E0'
        },
        background: '#FAFAFA'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.4s ease-out',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' }
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' }
        }
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 24px rgba(0,0,0,0.12)',
        bottom: '0 -2px 12px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      }
    }
  },
  plugins: []
}
