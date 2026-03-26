import { defineConfig } from "vite-plus"

const ignorePatterns = [
  "dist/",
  ".cache/",
  ".turbo/",
  ".output/",
  "bun.lock",
  "routeTree.gen.ts",
  ".tanstack-start/",
  ".tanstack/",
  "drizzle/",
  "migrations/",
  ".vercel",
  "node_modules/",
  "routeTree.gen.ts",
  "apps/app/src/assets/",
]
export default defineConfig({
  // Oxlint configuration.
  lint: {
    ignorePatterns,
    options: { typeAware: true, typeCheck: true },
    plugins: ["typescript", "promise", "react"],
    rules: {
      "no-unused-vars": "error",
      "react/rules-of-hooks": "error",
      "react/jsx-key": "error",
    },
  },

  // Oxfmt configuration.
  fmt: {
    semi: false,
    singleQuote: false,
    printWidth: 130,
    tabWidth: 2,
    trailingComma: "all",
    sortImports: {
      customGroups: [
        { groupName: "boilerplate", elementNamePattern: ["@boilerplate/**"] },
        { groupName: "local-alias", elementNamePattern: ["@/**"] },
      ],
      groups: [
        ["type-import", "value-builtin", "value-external"],
        "boilerplate",
        "local-alias",
        ["type-internal", "value-internal"],
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        "unknown",
      ],
    },
    sortTailwindcss: {
      stylesheet: "./tooling/tailwind/base.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn", "cva", "tw"],
    },
    ignorePatterns: ignorePatterns,
  },

  // Vite Task configuration.
  run: {
    tasks: {},
  },
})
