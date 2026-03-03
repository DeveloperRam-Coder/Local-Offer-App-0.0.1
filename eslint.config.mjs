// eslint.config.mjs
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: {},
      "@typescript-eslint": {},
    },
    settings: {
      react: { version: "detect" } // fixes "React version not specified" warning
    },
    rules: {
      // temporary relaxations (make lint actionable right now)
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }
      ],
      "react/no-unescaped-entities": "off",

      // keep important rules
      "no-console": "warn",
      "no-debugger": "error"
    }
  }
];
