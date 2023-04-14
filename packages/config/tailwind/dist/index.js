"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = void 0;
var colors_1 = require("./colors");
Object.defineProperty(exports, "colors", { enumerable: true, get: function () { return colors_1.colors; } });
var plugin = require("tailwindcss/plugin");
// allows writing sq-10 instead of h-10 w-10
var shapes = plugin(function (_a) {
    var matchUtilities = _a.matchUtilities, theme = _a.theme;
    matchUtilities({
        sq: function (value) { return ({ width: value, height: value }); },
        circle: function (value) { return ({ width: value, height: value, borderRadius: "9999px" }); },
    }, { values: theme("spacing") });
});
exports.default = {
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
                primary: colors_1.colors.pink,
                gray: colors_1.colors.gray,
            },
        },
    },
    plugins: [shapes],
};
