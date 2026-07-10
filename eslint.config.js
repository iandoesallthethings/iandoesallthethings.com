import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import ts from 'typescript-eslint'

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		rules: {
			// The whole site is {@html}-rendered CMS content; sanitization happens in the markdown pipeline
			'svelte/no-at-html-tags': 'off',
			'svelte/no-navigation-without-resolve': 'off',
		},
	},
	{
		files: ['**/*.cjs'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
	{
		ignores: ['build/', '.svelte-kit/', '.vercel/', 'node_modules/', 'content/', 'static/'],
	}
)
