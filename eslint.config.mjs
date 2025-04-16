import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: 2018,
        sourceType: "commonjs",
    },

    rules: {
        "arrow-body-style": "error",
        "array-bracket-spacing": "error",
        "array-callback-return": "error",
        "arrow-parens": "error",
        "arrow-spacing": "error",
        "block-scoped-var": 2,
        "brace-style": [2, "1tbs"],
        "comma-dangle": ["error", "never"],
        "comma-style": "error",
        "computed-property-spacing": [2, "never"],
        curly: 2,
        "default-case": 0,
        "dot-notation": "error",
        "eol-last": "error",
        eqeqeq: ["error", "smart"],
        "func-style": ["error", "expression"],
        indent: "error",
        "keyword-spacing": "error",
        "max-depth": ["error", 4],
        "max-statements": [1, 30],

        "max-len": ["error", {
            code: 135,
            tabWidth: 4,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true,
        }],

        "newline-per-chained-call": "error",
        "no-array-constructor": "error",
        "no-confusing-arrow": "error",
        "no-console": 0,
        "no-const-assign": "error",
        "no-dupe-class-members": "error",
        "no-duplicate-imports": "error",
        "no-else-return": 0,
        "no-eval": "warn",
        "no-extend-native": 2,
        "no-var": "warn",
        "no-new-object": "error",
        "no-new-func": "error",
        "no-useless-constructor": "error",
        "no-iterator": "error",
        "no-restricted-syntax": "error",
        "no-restricted-properties": "error",
        "no-undef": "error",
        "no-nested-ternary": "error",
        "no-mixed-spaces-and-tabs": 2,
        "no-trailing-spaces": 2,
        "no-use-before-define": "error",
        "no-whitespace-before-property": "error",
        "no-cond-assign": [2, "except-parens"],

        "no-unused-vars": ["error", {
            vars: "local",
            args: "none",
        }],

        "no-loop-func": "error",
        "object-shorthand": "error",
        "object-curly-spacing": [2, "always"],
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-template": "error",
        "quote-props": [1, "consistent-as-needed"],
        quotes: [1, "single"],
        radix: ["error", "as-needed"],
        semi: ["error", "always"],
        "space-unary-ops": 2,
        "spaced-comment": "error",
        "space-before-blocks": "error",
        "space-in-parens": "error",
        "template-curly-spacing": ["error", "never"],
        "wrap-iife": ["error", "any"],
    },
}]);