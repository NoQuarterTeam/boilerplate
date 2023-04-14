module.exports = function (api) {
  api.cache(true)
  process.env.EXPO_ROUTER_APP_ROOT = "../../apps/app/src/app"
  return {
    presets: [["module:metro-react-native-babel-preset", { useTransformReactJSXExperimental: true }], "babel-preset-expo"],
    plugins: [
      ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
      "nativewind/babel",
      "react-native-reanimated/plugin",
      require.resolve("expo-router/babel"),
    ],
  }
}
