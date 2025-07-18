/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // function ({ addUtilites, theme }) {
    //   addUtilites({
    //     '.inset-shadow-green-500': {
    //       'boc-shadow': `inset 0 2px 8px 0 ${theme('colors.green.500')}`
    //     }
    //   })
    // }
  ],
}
