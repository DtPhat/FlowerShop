/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./views/**/*.{html,ejs}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  content: [
    "./views/**/*.ejs",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('material-tailwindcss'),
    require('autoprefixer'),
  ],
};