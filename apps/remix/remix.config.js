const { flatRoutes } = require("remix-flat-routes")

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/*"],
  future: {
    // unstable_postcss: true,
    v2_meta: true,
    v2_routeConvention: true,
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    unstable_tailwind: true,
  },
  serverDependenciesToBundle: [
    "@boilerplate/api",
    "@boilerplate/database",
    "@boilerplate/database/types",
    "@boilerplate/emails",
    "@boilerplate/shared",
    "@boilerplate/tailwind-config",
    "@boilerplate/tailwind-config/src/colors",
    "@boilerplate/ui",
    "axios",
    "filter-obj",
    "query-string",
    "split-on-first",
  ],
  watchPaths: ["../../packages/api", "../../packages/emails", "../../packages/shared", "../../packages/ui"],
  routes: (defineRoutes) => {
    return flatRoutes("pages", defineRoutes)
  },
}
