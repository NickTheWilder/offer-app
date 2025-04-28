import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react: react,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        ignores: ["eslint.config.mjs", "node_modules/**", "dist/**", "build/**"],
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-module-boundary-types": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "error",
            "react/react-in-jsx-scope": "off",
        },
    },
];
