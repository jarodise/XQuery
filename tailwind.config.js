/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'x-blue': '#1d9bf0',
        'x-blue-dark': '#1a8cd8',
        'x-blue-light': '#4ec3f7',
        'x-dark': '#000000',
        'x-dark-elevated': '#16181c',
        'x-dark-surface': '#202327',
        'x-border': '#2f3336',
        'x-text': '#e7e9ea',
        'x-text-secondary': '#71767b',
      },
      fontFamily: {
        'display': ['JetBrains Mono', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'body': ['JetBrains Mono', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out': 'slideOut 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
