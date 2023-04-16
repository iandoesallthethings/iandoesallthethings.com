import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x',
			isr: {
				expiration: 60 * 60, // In seconds
				bypassToken: 'ahyesfresh',
				allowQuery: ['url'],
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
