/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          100: "#dbdbdb",
          200: "#ebebeb",
          300: "#f3f3f3",
        },
        highlight: "#9220d8",
        text: {
          100: "#292929",
          200: "#191919",
          300: "#000000",
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
