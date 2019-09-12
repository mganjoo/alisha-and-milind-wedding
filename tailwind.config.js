const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  theme: {
    extend: {
      colors: {
        "off-white": "#fffcf7",
      },
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
        serif: ["EB Garamond", ...defaultTheme.fontFamily.serif],
        display: ["Playfair Display"],
      },
    },
  },
  variants: {},
  plugins: [],
}
