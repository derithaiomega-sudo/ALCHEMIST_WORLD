import js from "@eslint/js";

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**"]
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "off"
    }
  }
];
