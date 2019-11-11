const defaultTheme = require("tailwindcss/defaultTheme")
const sharedConstants = require("./shared-constants")

module.exports = {
  theme: {
    extend: {
      colors: {
        "off-white": sharedConstants.offWhite,
      },
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.sans],
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
      const checkboxColor = theme("colors.orange.600")
      const sharedStyles = {
        borderColor: theme("colors.gray.400"),
        "&:focus": {
          boxShadow: theme("boxShadow.outline-light"),
          borderColor: theme("colors.orange.500"),
        },
      }
      return {
        default: {
          input: {
            borderRadius: theme("borderRadius.lg"),
            ...sharedStyles,
          },
          radio: {
            color: checkboxColor,
            ...sharedStyles,
          },
          checkbox: {
            color: checkboxColor,
            ...sharedStyles,
          },
        },
      }
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/custom-forms")],
}
