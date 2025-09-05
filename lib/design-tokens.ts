// Design System Tokens for EduConnect
export const designTokens = {
  // Color System
  colors: {
    // Primary palette (Blue)
    primary: {
      50: 'hsl(210, 100%, 97%)',
      100: 'hsl(210, 100%, 94%)',
      200: 'hsl(210, 100%, 87%)',
      300: 'hsl(210, 100%, 78%)',
      400: 'hsl(210, 98%, 66%)',
      500: 'hsl(210, 80%, 45%)', // Main primary
      600: 'hsl(210, 85%, 38%)',
      700: 'hsl(210, 90%, 32%)',
      800: 'hsl(210, 95%, 26%)',
      900: 'hsl(210, 100%, 20%)',
      950: 'hsl(210, 100%, 12%)',
    },
    
    // Secondary palette (Teal/Accent)
    secondary: {
      50: 'hsl(160, 85%, 96%)',
      100: 'hsl(160, 80%, 91%)',
      200: 'hsl(160, 75%, 82%)',
      300: 'hsl(160, 70%, 70%)',
      400: 'hsl(160, 68%, 58%)',
      500: 'hsl(160, 70%, 50%)', // Main accent
      600: 'hsl(160, 75%, 42%)',
      700: 'hsl(160, 80%, 35%)',
      800: 'hsl(160, 85%, 28%)',
      900: 'hsl(160, 90%, 22%)',
      950: 'hsl(160, 95%, 14%)',
    },
    
    // Semantic colors
    success: {
      50: 'hsl(142, 76%, 96%)',
      500: 'hsl(142, 71%, 45%)',
      600: 'hsl(142, 76%, 36%)',
    },
    warning: {
      50: 'hsl(48, 96%, 95%)',
      500: 'hsl(48, 96%, 53%)',
      600: 'hsl(48, 96%, 45%)',
    },
    error: {
      50: 'hsl(0, 86%, 97%)',
      500: 'hsl(0, 84%, 60%)',
      600: 'hsl(0, 84%, 52%)',
    },
    
    // Neutral palette
    neutral: {
      0: 'hsl(0, 0%, 100%)',
      50: 'hsl(210, 40%, 98%)',
      100: 'hsl(210, 40%, 96%)',
      200: 'hsl(210, 25%, 88%)',
      300: 'hsl(210, 20%, 77%)',
      400: 'hsl(210, 15%, 65%)',
      500: 'hsl(210, 10%, 52%)',
      600: 'hsl(210, 15%, 40%)',
      700: 'hsl(210, 20%, 30%)',
      800: 'hsl(210, 25%, 20%)',
      900: 'hsl(210, 30%, 10%)',
      950: 'hsl(210, 35%, 5%)',
    },
  },
  
  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  // Spacing Scale (8px base)
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    5: '1.25rem', // 20px
    6: '1.5rem',  // 24px
    8: '2rem',    // 32px
    10: '2.5rem', // 40px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
    20: '5rem',   // 80px
    24: '6rem',   // 96px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glass: '0 8px 32px 0 rgb(31 38 135 / 0.37)',
    glow: '0 0 20px rgb(59 130 246 / 0.5)',
  },
  
  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// Accessibility helpers
export const a11y = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  srOnly: 'sr-only',
  skipLink: 'absolute left-[-10000px] top-auto w-1 h-1 overflow-hidden focus:left-6 focus:top-7 focus:w-auto focus:h-auto focus:overflow-visible',
  minTouchTarget: 'min-h-[44px] min-w-[44px]', // 44px minimum for touch targets
} as const;

// Component variants
export const componentVariants = {
  button: {
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    },
    variant: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500',
      outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      danger: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
    },
  },
  card: {
    variant: {
      default: 'bg-white border border-neutral-200 shadow-base',
      glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-glass',
      elevated: 'bg-white border border-neutral-200 shadow-lg',
      interactive: 'bg-white border border-neutral-200 shadow-base hover:shadow-md transition-shadow',
    },
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
} as const;
