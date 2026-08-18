/** Compiled once (or on change) into app/static/styles.css — see README.
 * No Node runtime needed on Railway; only the committed CSS output ships. */
module.exports = {
  content: ["./app/static/**/*.html", "./app/static/**/*.js"],
  theme: {
    extend: {
      colors: {
        navy: "#19296D",
        accent: "#0253FE",
      },
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "-apple-system",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
