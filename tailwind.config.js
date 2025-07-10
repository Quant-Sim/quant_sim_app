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
        'fox-purple': '#6D4AFF',
        'fox-light-purple': '#ECE8FF',
        'fox-dark-blue': '#23223C',
        'fox-light-gray': '#F6F5FB',
        'fox-text-gray': '#A1A1AA',
      },
    },
  },
  plugins: [],
};