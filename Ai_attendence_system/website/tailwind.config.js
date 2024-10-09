/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#387DC1",
        secondary: "#22d3ee",
      }
    },
  },
  plugins: [],
}
