/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        subaru: {
          blue: '#0033A0',
          gold: '#FFD100',
          gray: '#ECECEC',
        },
      },
    },
  },
  plugins: [],
}

