/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kantumruy: ['"Kantumruy Pro"', 'sans-serif'],
        koh: ['"Koh Santepheap"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}