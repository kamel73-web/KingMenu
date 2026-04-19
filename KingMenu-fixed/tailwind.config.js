/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {

        // ── Primaire : Violet royal ────────────────────────────────────
        primary: {
          50:  '#F7F5FF',
          100: '#EDE9FE',
          200: '#D8D0FC',
          300: '#B8A9F8',
          400: '#7C50F0',
          500: '#5E2EED',
          600: '#4F24D6',
          700: '#4A20C8',
          800: '#3E1A9D',
          900: '#2E1278',
        },

        // ── Secondaire : Orange épicé ──────────────────────────────────
        secondary: {
          50:  '#FFF4EC',
          100: '#FFE4CC',
          200: '#FFC799',
          300: '#FFA366',
          400: '#FF8033',
          500: '#FF6B00',
          600: '#E56000',
          700: '#C24F00',
          800: '#9A3F00',
          900: '#7C3200',
        },

        // ── Accentuation : Menthe fraîche ──────────────────────────────
        accent: {
          50:  '#E6FBF5',
          100: '#C0F4E4',
          200: '#85E8CA',
          300: '#3DD9AD',
          400: '#00C896',
          500: '#00A87E',
          600: '#008A68',
          700: '#006C52',
          800: '#004F3C',
          900: '#003328',
        },

        // ── Fonds et surfaces ──────────────────────────────────────────
        background: {
          page:      '#F9F8FF',
          card:      '#F3F2F7',
          cardHover: '#EEEDF5',
          dark:      '#1A1A2E',
          darkCard:  '#252540',
          darkHover: '#2E2E50',
        },

        // ── Textes ─────────────────────────────────────────────────────
        content: {
          title:    '#0D0D1A',
          body:     '#3D3D5C',
          muted:    '#6B6B8A',
          hint:     '#9999B3',
          inverted: '#F0EEFF',
        },

        // ── Sémantique ─────────────────────────────────────────────────
        success: {
          50:  '#E6FBF5',
          100: '#C0F4E4',
          500: '#00C896',
          600: '#008A68',
          700: '#006C52',
        },
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#FFB830',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50:  '#FFF1F1',
          100: '#FFD7D7',
          500: '#E84040',
          600: '#C73030',
          700: '#A52020',
        },
        info: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },

        // ── Neutres (remplace warm-gray) ───────────────────────────────
        neutral: {
          50:  '#F9F8FF',
          100: '#F0EFF8',
          200: '#E2E0EF',
          300: '#C8C6DC',
          400: '#9E9BB8',
          500: '#6B6B8A',
          600: '#4D4D6A',
          700: '#3D3D5C',
          800: '#252540',
          900: '#1A1A2E',
        },

        // ── Conservé pour compatibilité rétro ─────────────────────────
        'warm-gray': {
          50:  '#FAFAF9',
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

      // ── Typographie ──────────────────────────────────────────────────
      fontFamily: {
        heading: [
          'Inter',
          'Nunito',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        body: [
          'Inter',
          'Nunito',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        arabic: ['Noto Naskh Arabic', 'serif'],
      },

      fontSize: {
        xs:   ['0.6875rem', { lineHeight: '1rem',    letterSpacing: '0.02em' }],
        sm:   ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        base: ['0.9375rem', { lineHeight: '1.6rem'  }],
        lg:   ['1.0625rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',   { lineHeight: '1.8rem'  }],
        '2xl':['1.5rem',    { lineHeight: '2rem'    }],
        '3xl':['1.875rem',  { lineHeight: '2.25rem' }],
        '4xl':['2.25rem',   { lineHeight: '2.5rem'  }],
      },

      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
        extrabold:'800',
      },

      // ── Espacement ───────────────────────────────────────────────────
      spacing: {
        4.5:  '1.125rem',
        13:   '3.25rem',
        18:   '4.5rem',
        88:   '22rem',
        128:  '32rem',
      },

      // ── Bordures ─────────────────────────────────────────────────────
      borderRadius: {
        sm:   '6px',
        DEFAULT:'8px',
        md:   '10px',
        lg:   '14px',
        xl:   '18px',
        '2xl':'22px',
        '3xl':'28px',
        full: '9999px',
      },

      // ── Ombres ───────────────────────────────────────────────────────
      boxShadow: {
        // Ombres légèrement teintées violet pour cohérence avec la palette
        soft:   '0 2px 12px -2px rgba(94,46,237,0.08), 0 8px 16px -4px rgba(94,46,237,0.04)',
        medium: '0 4px 20px -4px rgba(94,46,237,0.12), 0 8px 16px -4px rgba(94,46,237,0.06)',
        strong: '0 8px 32px -8px rgba(94,46,237,0.18), 0 4px 16px -4px rgba(94,46,237,0.10)',
        card:   '0 1px 4px rgba(94,46,237,0.06), 0 4px 12px rgba(94,46,237,0.04)',
        // Focus ring primaire
        focus:  '0 0 0 3px rgba(94,46,237,0.25)',
        // Focus ring secondaire
        focusOrange: '0 0 0 3px rgba(255,107,0,0.25)',
        none:   'none',
      },

      // ── Animations ───────────────────────────────────────────────────
      animation: {
        'fade-in':      'fadeIn 0.5s ease-in-out',
        'slide-up':     'slideUp 0.3s ease-out',
        'slide-down':   'slideDown 0.3s ease-out',
        'scale-in':     'scaleIn 0.2s ease-out',
        'bounce-gentle':'bounceGentle 0.6s ease-in-out',
        'float':        'float 3s ease-in-out infinite',
        'pulse-soft':   'pulseSoft 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)'   },
          '40%':      { transform: 'translateY(-8px)' },
          '60%':      { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-4px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.6' },
        },
      },

      // ── Transitions ──────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '150ms',
        fast:    '100ms',
        normal:  '200ms',
        slow:    '300ms',
      },

      transitionTimingFunction: {
        DEFAULT:  'cubic-bezier(0.4, 0, 0.2, 1)',
        spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth:   'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],

  safelist: [
    // RTL
    'rtl:text-right',
    'rtl:text-left',
    'rtl:ml-auto',
    'rtl:mr-auto',
    'rtl:pl-10',
    'rtl:pr-4',
    'rtl:border-l',
    'rtl:border-r',
    // Couleurs dynamiques utilisées en JS
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-500',
    'text-primary-500',
    'text-primary-600',
    'bg-secondary-500',
    'text-secondary-500',
    'bg-accent-400',
    'text-accent-700',
    'bg-success-50',
    'text-success-600',
    'bg-warning-50',
    'text-warning-600',
    'bg-error-50',
    'text-error-600',
    'bg-neutral-50',
    'bg-neutral-100',
    'bg-neutral-900',
  ],
};
