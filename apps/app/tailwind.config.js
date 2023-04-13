/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@boilerplate/tailwind-config")],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      body: ["Poppins_400Regular"],
      label: ["Poppins_600SemiBold"],
      heading: ["Poppins_700Bold"],
      "extra-thick": ["Poppins_900Black"],
    },
  },
}
