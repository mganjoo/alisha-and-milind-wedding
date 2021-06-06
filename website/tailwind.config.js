const defaultTheme = require("tailwindcss/defaultTheme")
const sharedConstants = require("./shared-constants")

module.exports = {
  theme: {
    extend: {
      colors: {
        orange: {
          // Tailwind 1 colors
          100: "#fffaf0",
          200: "#feebc8",
          300: "#fbd38d",
          400: "#f6ad55",
          500: "#ed8936",
          600: "#dd6b20",
          700: "#c05621",
          800: "#9c4221",
          900: "#7b341e",
        },
        "off-white": sharedConstants.offWhite,
        invalid: defaultTheme.colors.red["400"],
        "gray-subtle": defaultTheme.colors.gray["400"],
        "red-subtle": "#e6c9bd",
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
      screens: {
        print: { raw: "print" },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms")],
  purge: {
    content: ["./src/**/*.tsx"],
    options: {
      rejected: true,
    },
  },
}
