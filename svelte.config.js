import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x',
			isr: {
				// Lets try just under an hour. The url changing might pop the cache that often anyway.
				expiration: 60 * 58,
			},
		}),
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
