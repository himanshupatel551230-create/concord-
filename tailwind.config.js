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
        ink: {
          950: '#070A12',
          900: '#0B0F19',
          850: '#0E1626',
          800: '#131D31',
          750: '#19263E',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
          400: '#64748B',
          300: '#94A3B8',
          200: '#CBD5E1',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        concord: {
          teal: {
            DEFAULT: '#0D9488',
            light: '#14B8A6',
            glow: '#2DD4BF',
            dark: '#0F766E',
            bg: '#042F2E',
          },
          amber: {
            DEFAULT: '#D97706',
            light: '#F59E0B',
            bg: '#451A03',
          },
          red: {
            DEFAULT: '#DC2626',
            light: '#EF4444',
            bg: '#450A0A',
          },
          emerald: {
            DEFAULT: '#059669',
            light: '#10B981',
            bg: '#064E3B',
          }
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'control-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'control': '0 4px 12px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glow-teal': '0 0 20px -3px rgba(20, 184, 166, 0.25)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
}
