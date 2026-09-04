/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#2D2B55',
        accent: '#FF6B6B',
        dark: '#1A1A2E',
        light: '#F8F9FA'
      }
    },
  },
  plugins: [],
}