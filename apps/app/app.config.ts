import type { ExpoConfig } from "expo/config"

const IS_DEV = process.env.APP_VARIANT === "development"

const VERSION = "0.0.1"
const BUILD = 1

export default {
  name: IS_DEV ? "Boilerplate (Dev)" : "Boilerplate",
  slug: "boilerplate",
  scheme: "boilerplate",
  version: VERSION,
  owner: "noquarter",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  extra: {
    eas: {
      projectId: "2d3e9c31-6262-47f3-8455-3c39c9bb4df9",
    },
  },
  ios: {
    buildNumber: BUILD.toString(),
    supportsTablet: true,
    bundleIdentifier: "co.noquarter.boilerplate",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: { backgroundColor: "#ffffff" },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      { imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff", dark: { backgroundColor: "#000000" } },
    ],
    "expo-asset",
    "expo-web-browser",
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    reactCanary: true,
    autolinkingModuleResolution: true,
  },
  runtimeVersion: { policy: "nativeVersion" },
} satisfies ExpoConfig
