const twColors = require("tailwindcss/colors")

delete twColors["lightBlue"]
delete twColors["warmGray"]
delete twColors["trueGray"]
delete twColors["coolGray"]
delete twColors["blueGray"]

const gray = {
  50: "#FAFAFA",
  75: "#EFEFEF",
  100: "#D9DADC",
  200: "#B5B7BA",
  300: "#919598",
  400: "#4A4F52",
  500: "#6D7275",
  600: "#373C3F",
  700: "#24282A",
  800: "#121516",
  900: "#040404",
  950: "#010101",
}
module.exports = {
  ...twColors,
  primary: twColors.pink,
  gray,
}
