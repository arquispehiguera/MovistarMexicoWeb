/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css,scss}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#009EF7",
          light: "#33B1F8",
          dark: "#007ACC",
        },
        secondary: {
          DEFAULT: "#5CB615",
          light: "#7FCA3D",
          dark: "#439011",
        },
        accent: {
          DEFAULT: "#E63780",
          light: "#F068A0",
          dark: "#C01F60",
        },
        success: {
          DEFAULT: "#16a34a",
          light: "#22c55e",
          dark: "#15803d",
        },
        danger: {
          DEFAULT: "#dc2626",
          light: "#ef4444",
          dark: "#b91c1c",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        info: {
          DEFAULT: "#0ea5e9",
          light: "#38bdf8",
          dark: "#0369a1",
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
  ],
};
