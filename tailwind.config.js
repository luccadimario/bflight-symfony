/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
    "./assets/react/**/*.tsx",
  ],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}

