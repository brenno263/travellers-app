import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

/*
Here we define a list of configuration objects for ESLint.

When multiple configs match a file, they are merged together, with later configs
taking predcedence. This way we set up a global config, then override and add
some parts for specific base directories which we want to have different rules.

*/

export default defineConfig([
	globalIgnores(["**/dist", "eslint.config.ts"]),

	{
		name: "base config",
		basePath: ".",
		extends: [tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2026,
			sourceType: "module",
			parserOptions: {
				projectService: true,
			},
		},
		linterOptions: {
			reportUnusedDisableDirectives: "error",
		},
	},

	// Client config
	{
		name: "client config",
		basePath: "./client",
		extends: [
			tseslint.configs.recommendedTypeChecked,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
			reactX.configs["recommended-typescript"],
			reactDom.configs.recommended,
		],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			globals: globals.browser,
		},
	},

	// Server config
	{
		name: "server config",
		basePath: "./server",
		extends: [tseslint.configs.recommendedTypeChecked],
		files: ["**/*.{ts}"],
		languageOptions: {
			globals: globals.node,
		},
	},
]);
