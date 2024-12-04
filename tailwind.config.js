/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#5CB85C',
        'brand-danger': '#B85C5C',
        // 다크모드 색상
        dark: {
          'bg-primary': '#1a1a1a',
          'bg-secondary': '#242424',
          'text-primary': '#ffffff',
          'text-secondary': '#a0a0a0',
        },
      },
      fontFamily: {
        logo: ['Titillium Web', 'sans-serif'],
        sans: ['Source Sans Pro', 'sans-serif'],
        serif: ['Source Serif Pro', 'serif'],
        heading: ['Merriweather Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({addUtilities}) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.touch-scroll': {
          '-webkit-overflow-scrolling': 'touch',
          'scroll-behavior': 'smooth',
        },
      });
    },
  ],
};
