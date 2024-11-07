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
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Hide scrollbar but keep content scrollable */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
      });
    },
  ],
};
