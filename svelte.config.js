// import adapter from '@sveltejs/adapter-auto'
// import adapter from '@sveltejs/adapter-static'
import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// prerender: { entries: ['*'] },
		adapter: adapter(),
		alias: {
			$types: './src/types',
			$components: './src/components',
			$db: './src/db',
			$ukiyo: './src/lib/ukiyo',
		},
	},
	preprocess: vitePreprocess(),
}

export default config
