/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for your hotel dashboard
        hotel: {
          primary: '#1e40af',
          secondary: '#f59e0b',
          accent: '#dc2626'
        }
      },
    },
  },
  plugins: [],
}