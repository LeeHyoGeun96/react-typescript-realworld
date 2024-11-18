/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        mobile: {max: '768px'},
        tablet: {min: '769px', max: '1024px'},
        desktop: {min: '1025px'},
      },
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
  plugins: [],
};
