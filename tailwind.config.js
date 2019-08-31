const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  theme: {
    extend: {
      colors: {
        orange: {
          ...defaultTheme.colors.orange,
          "100": "#FFFCF7",
        },
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
