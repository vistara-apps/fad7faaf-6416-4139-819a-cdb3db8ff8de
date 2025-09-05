/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 45%)',
        accent: 'hsl(160, 70%, 50%)',
        bg: 'hsl(210, 30%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(210, 30%, 10%)',
        'text-secondary': 'hsl(210, 30%, 40%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 30%, 10%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
