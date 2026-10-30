import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palet Sango Hotel Management: emas, krem, charcoal.
        primary: {
          DEFAULT: '#A67C2E',
          hover: '#8C6825',
          dark: '#5B4318',
          surface: '#F7F0E5',
        },
        action: {
          DEFAULT: '#12100C',
          hover: '#2B231B',
          soft: '#F1E4C4',
          ink: '#5B4318',
        },
        sango: {
          ink: '#100B07',
          cream: '#F7F0E5',
          gold: '#D9BD69',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#1DA851',
          dark: '#128C7E',
        },
        canvas: '#FBF8F2',
        success: '#2F7D5D',
        // Netral hangat: menghindari rona biru agar selaras dengan krem.
        slate: {
          50: '#FAF9F7',
          100: '#F4F1EC',
          200: '#E7E2D9',
          300: '#D6CFC2',
          400: '#A89F8F',
          500: '#7A7164',
          600: '#575043',
          700: '#443E34',
          800: '#2A251E',
          900: '#1C1813',
          950: '#0C0A07',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-sans)',
          'DM Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 3px rgba(28, 24, 19, 0.06)',
        sheet: '0 -8px 32px rgba(28, 24, 19, 0.16)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-480px 0' },
          '100%': { backgroundPosition: '480px 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
        shimmer: 'shimmer 1.4s linear infinite',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;