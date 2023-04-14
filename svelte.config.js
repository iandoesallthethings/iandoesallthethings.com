import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$types: './src/types',
			$components: './src/components',
			$ukiyo: './src/lib/ukiyo',
		},
	},
	preprocess: vitePreprocess(),
}

export default config
