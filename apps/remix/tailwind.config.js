/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  presets: [require("@boilerplate/tailwind-config/dist")],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "!./app/pages/emails+/**/*", "../../packages/ui/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxxs: "0.4rem",
        xxs: "0.625rem",
      },
    },
    fontFamily: {
      heading: ["Poppins", "sans-serif"],
      body: ["Poppins", "sans-serif"],
      mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-radix")],
}
