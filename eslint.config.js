import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // General ESLint rules
      semi: ["error", "always"], // Require semicolons
      "no-unused-vars": "warn", // Warn on unused variables

      // Existing rules...
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // TypeScript-specific rules (from @typescript-eslint)
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh rules
      "react-refresh/only-export-components": "warn",
    },
  },
]);
