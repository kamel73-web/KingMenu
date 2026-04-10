/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F4F6F2',
          100: '#E4E8DF',
          200: '#CBD3C2',
          300: '#AEBBA2',
          400: '#8F9F80',
          500: '#6B7B5E',
          600: '#556348',
          700: '#434E39',
          800: '#333C2B',
          900: '#262E1F',
        },
        secondary: {
          50: '#FFF6F0',
          100: '#FEE8DB',
          200: '#FDD0B6',
          300: '#FBB38A',
          400: '#F8925C',
          500: '#E26D32',
          600: '#C45824',
          700: '#9E461C',
          800: '#7A3614',
          900: '#5E290F',
        },
        accent: {
          50: '#F0F7F4',
          100: '#D9EDE4',
          200: '#B5DDCE',
          300: '#8DCAB5',
          400: '#65B89B',
          500: '#3FA682',
          600: '#2F8A6B',
          700: '#236E54',
          800: '#19543F',
          900: '#113D2E',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        'warm-gray': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },

      fontFamily: {
        // Archivo Black pour les titres principaux (remplace Georgia)
        heading: ['Archivo Black', 'Playfair Display', 'Georgia', 'serif'],
        // Playfair Display pour les sous-titres élégants
        subheading: ['Playfair Display', 'Georgia', 'serif'],
        // Inter pour le corps de texte
        body: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        arabic: ['Noto Naskh Arabic', 'serif'],
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
      },

      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },

      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        strong: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
        elevated: '0 20px 35px -12px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.02)',
        card: '0 8px 30px -8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02)',
        hover: '0 25px 40px -12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.02)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        float: 'float 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],

  safelist: [
    'rtl:text-right',
    'rtl:text-left',
    'rtl:ml-auto',
    'rtl:mr-auto',
    'rtl:pl-10',
    'rtl:pr-4',
    'rtl:border-l',
    'rtl:border-r',
  ],
};
