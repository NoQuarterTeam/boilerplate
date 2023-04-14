import { colors } from "./colors"
import * as plugin from "tailwindcss/plugin"
import { type Config } from "tailwindcss"

// allows writing sq-10 instead of h-10 w-10
const shapes = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      sq: (value) => ({ width: value, height: value }),
      circle: (value) => ({ width: value, height: value, borderRadius: "9999px" }),
    },
    { values: theme("spacing") },
  )
})

export { colors }
export default {
  content: [],
  theme: {
    extend: {
      spacing: {
        full: "100%",
      },
      borderRadius: {
        xs: "2px",
      },
      colors: {
        primary: colors.pink,
        gray: colors.gray,
      },
    },
  },
  plugins: [shapes],
} satisfies Config
