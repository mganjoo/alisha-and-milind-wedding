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
        "outline-input": "0 0 0 3px rgba(237, 137, 54, 0.5)",
        "outline-button": "0 0 0 5px rgba(237, 137, 54, 0.5)",
      },
    },
    customForms: theme => {
      const overriddenStyles = {
        borderRadius: theme("borderRadius.lg"),
        borderColor: theme("colors.gray.400"),
        fontSize: theme("fontSize.lg"),
        "&:focus": {
          boxShadow: theme("boxShadow.outline-input"),
          borderColor: theme("colors.orange.500"),
        },
      }
      return {
        default: {
          input: overriddenStyles,
          textarea: overriddenStyles,
        },
      }
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
}
