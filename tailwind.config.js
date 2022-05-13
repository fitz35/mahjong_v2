module.exports = {
  content: ["./src/**/*.{html,js,tsx}", './public/index.html'],
  theme: {
    extend: {
      colors: {
        pageBase : '#996B2E', // white text
        pageLight : "#CC9752", // dark text
        pageVeryLight : "#FFC880", //dark text
        pageDark : "#664314", // white text
        pageVeryDark : "#331F05" // white text
      }
    },
  },
  plugins: [],
}
