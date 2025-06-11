/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#46a080',
        secondary: '#e6f4ef',
        dark: '#0c1c17',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
} 