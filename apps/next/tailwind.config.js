/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  presets: [require("@boilerplate/tailwind-config/dist")],
  content: ["./src/**/*.{js,ts,jsx,tsx}", "../../packages/ui/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxxs: "0.4rem",
        xxs: "0.625rem",
      },
    },
    fontFamily: {
      sans: ["var(--font-poppins)"],
      serif: ["var(--font-poppins)"],
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-radix")],
}
