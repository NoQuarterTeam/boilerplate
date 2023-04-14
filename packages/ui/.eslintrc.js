/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  root: true,
  extends: ["@boilerplate/eslint-config"],
  rules: {
    "react/function-component-definition": "off",
  },
}
