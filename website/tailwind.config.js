const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")
const sharedConstants = require("./shared-constants")

module.exports = {
  theme: {
    extend: {
      colors: {
        gray: colors.stone,
        // Main text, etc
        primary: {
          DEFAULT: colors.stone["900"],
          night: colors.stone["100"],
          print: colors.black,
        },
        secondary: {
          DEFAULT: colors.stone["800"],
          night: colors.stone["200"],
        },
        tertiary: {
          DEFAULT: colors.stone["700"],
          night: colors.stone["300"],
        },
        // Main background color
        background: {
          DEFAULT: sharedConstants.offWhite,
          night: colors.stone["900"],
          "secondary-night": colors.stone["800"],
          print: colors.white,
        },
        // Borders, etc
        subtle: {
          DEFAULT: colors.stone["400"],
          night: colors.stone["700"],
        },
        // Headers
        heading: {
          primary: {
            DEFAULT: colors.orange["900"],
            night: colors.orange["400"],
          },
          secondary: {
            DEFAULT: colors.stone["700"],
            night: colors.stone["200"],
          },
          print: colors.black,
        },
        // High contrast UI elements - focus rings, hover states, accent text
        accent: {
          DEFAULT: colors.orange["600"],
          night: colors.orange["600"],
          focus: {
            DEFAULT: colors.orange["300"],
            night: colors.orange["200"],
          },
          hover: {
            DEFAULT: colors.orange["600"],
            night: colors.orange["500"],
          },
          text: {
            DEFAULT: colors.orange["900"],
            night: colors.orange["400"],
          },
        },
        button: {
          primary: {
            DEFAULT: colors.orange["900"],
            night: colors.orange["700"],
          },
          secondary: {
            DEFAULT: colors.orange["800"],
            night: colors.orange["500"],
          },
        },
        form: {
          background: {
            DEFAULT: colors.white,
            night: colors.gray["600"],
            error: colors.red["200"],
          },
          text: {
            DEFAULT: colors.gray["900"],
            night: colors.gray["100"],
            // Color of input text when in error state
            error: colors.red["800"],
          },
          focus: {
            DEFAULT: colors.orange["600"],
            night: colors.orange["500"],
          },
          placeholder: {
            DEFAULT: colors.gray["500"],
            night: colors.gray["400"],
            // Color of placeholder text when in error state
            error: colors.red["400"],
          },
          invalid: {
            DEFAULT: colors.red["700"],
            night: colors.red["400"],
          },
        },
      },
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.sans],
        serif: ["EB Garamond", ...defaultTheme.fontFamily.serif],
        script: ["Tangerine", ...defaultTheme.fontFamily.serif],
      },
      backgroundImage: {
        "hero-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='80' height='88' viewBox='0 0 80 88' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 21.91V26h-2c-9.94 0-18 8.06-18 18 0 9.943 8.058 18 18 18h2v4.09c8.012.722 14.785 5.738 18 12.73 3.212-6.99 9.983-12.008 18-12.73V62h2c9.94 0 18-8.06 18-18 0-9.943-8.058-18-18-18h-2v-4.09c-8.012-.722-14.785-5.738-18-12.73-3.212 6.99-9.983 12.008-18 12.73zM54 58v4.696c-5.574 1.316-10.455 4.428-14 8.69-3.545-4.262-8.426-7.374-14-8.69V58h-5.993C12.27 58 6 51.734 6 44c0-7.732 6.275-14 14.007-14H26v-4.696c5.574-1.316 10.455-4.428 14-8.69 3.545 4.262 8.426 7.374 14 8.69V30h5.993C67.73 30 74 36.266 74 44c0 7.732-6.275 14-14.007 14H54zM42 88c0-9.94 8.06-18 18-18h2v-4.09c8.016-.722 14.787-5.738 18-12.73v7.434c-3.545 4.262-8.426 7.374-14 8.69V74h-5.993C52.275 74 46 80.268 46 88h-4zm-4 0c0-9.943-8.058-18-18-18h-2v-4.09c-8.012-.722-14.785-5.738-18-12.73v7.434c3.545 4.262 8.426 7.374 14 8.69V74h5.993C27.73 74 34 80.266 34 88h4zm4-88c0 9.943 8.058 18 18 18h2v4.09c8.012.722 14.785 5.738 18 12.73v-7.434c-3.545-4.262-8.426-7.374-14-8.69V14h-5.993C52.27 14 46 7.734 46 0h-4zM0 34.82c3.213-6.992 9.984-12.008 18-12.73V18h2c9.94 0 18-8.06 18-18h-4c0 7.732-6.275 14-14.007 14H14v4.696c-5.574 1.316-10.455 4.428-14 8.69v7.433z' fill='%23f5d2a8' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        "hero-pattern-night":
          "url(\"data:image/svg+xml,%3Csvg width='80' height='88' viewBox='0 0 80 88' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 21.91V26h-2c-9.94 0-18 8.06-18 18 0 9.943 8.058 18 18 18h2v4.09c8.012.722 14.785 5.738 18 12.73 3.212-6.99 9.983-12.008 18-12.73V62h2c9.94 0 18-8.06 18-18 0-9.943-8.058-18-18-18h-2v-4.09c-8.012-.722-14.785-5.738-18-12.73-3.212 6.99-9.983 12.008-18 12.73zM54 58v4.696c-5.574 1.316-10.455 4.428-14 8.69-3.545-4.262-8.426-7.374-14-8.69V58h-5.993C12.27 58 6 51.734 6 44c0-7.732 6.275-14 14.007-14H26v-4.696c5.574-1.316 10.455-4.428 14-8.69 3.545 4.262 8.426 7.374 14 8.69V30h5.993C67.73 30 74 36.266 74 44c0 7.732-6.275 14-14.007 14H54zM42 88c0-9.94 8.06-18 18-18h2v-4.09c8.016-.722 14.787-5.738 18-12.73v7.434c-3.545 4.262-8.426 7.374-14 8.69V74h-5.993C52.275 74 46 80.268 46 88h-4zm-4 0c0-9.943-8.058-18-18-18h-2v-4.09c-8.012-.722-14.785-5.738-18-12.73v7.434c3.545 4.262 8.426 7.374 14 8.69V74h5.993C27.73 74 34 80.266 34 88h4zm4-88c0 9.943 8.058 18 18 18h2v4.09c8.012.722 14.785 5.738 18 12.73v-7.434c-3.545-4.262-8.426-7.374-14-8.69V14h-5.993C52.27 14 46 7.734 46 0h-4zM0 34.82c3.213-6.992 9.984-12.008 18-12.73V18h2c9.94 0 18-8.06 18-18h-4c0 7.732-6.275 14-14.007 14H14v4.696c-5.574 1.316-10.455 4.428-14 8.69v7.433z' fill='%2371604c' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E\")",
        exclamation:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23ef4444'%3E%3Cpath d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z'/%3E%3C/svg%3E\")",
        "exclamation-night":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23dc2626'%3E%3Cpath d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
  content: ["./src/**/*.{tsx, module.css}"],
}
