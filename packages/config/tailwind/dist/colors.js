"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
var twColors = require("tailwindcss/colors");
delete twColors["lightBlue"];
delete twColors["warmGray"];
delete twColors["trueGray"];
delete twColors["coolGray"];
delete twColors["blueGray"];
exports.colors = __assign(__assign({}, twColors), { primary: twColors.pink, gray: {
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
    } });
