// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	kit: {
		adapter: adapter(),
		alias: {
			$types: './src/types',
			$components: './src/components',
			$db: './src/db',
			$ukiyo: './src/lib/ukiyo',
		},
	}
}

export default config
