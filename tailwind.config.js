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
        display: ["Playfair Display", ...defaultTheme.fontFamily.serif],
        script: ["Arizonia", ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        "outline-light": "0 0 0 3px rgba(237, 137, 54, 0.5)",
        "outline-bold": "0 0 0 5px rgba(237, 137, 54, 0.5)",
      },
    },
    customForms: theme => {
      return {
        default: {
          input: {
            borderRadius: theme("borderRadius.lg"),
            borderColor: theme("colors.gray.400"),
            "&:focus": {
              boxShadow: theme("boxShadow.outline-light"),
              borderColor: theme("colors.orange.500"),
            },
          },
        },
      }
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
}
