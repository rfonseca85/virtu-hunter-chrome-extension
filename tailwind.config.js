/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#e2fbeb',
          100: '#b8f3cf',
          200: '#83ecaf',
          300: '#2fe48d', // main
          400: '#00dc71',
          500: '#00d25a',
          600: '#00c24f',
          700: '#00ae41',
          800: '#009c36',
          900: '#007b20',
        },
        gray: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e6e6e6',
          300: '#d5d5d5',
          400: '#b0b0b0',
          500: '#909090',
          600: '#686868',
          700: '#555555',
          800: '#202020',
          900: '#171717', // main
        },
      },
    },
  },
  plugins: [],
});
