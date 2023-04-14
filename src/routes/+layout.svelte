<script lang="ts">
	import '../app.css'
	import 'highlight.js/styles/github.css'
	import { dev } from '$app/environment'
	import { inject as VercelAnalytics } from '@vercel/analytics'
	import { webVitals as VercelWebVitals } from '$lib/vitals'
	import Header from '$components/Header.svelte'
	import Pool from '$ukiyo/Pool.svelte'
	import Konami from '$components/Konami.svelte'
	import Footer from '$components/Footer.svelte'
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

	VercelAnalytics({ mode: dev ? 'development' : 'production' })

	let analyticsId: string = import.meta.env.VERCEL_ANALYTICS_ID

	$: if (browser && analyticsId) {
		VercelWebVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId,
		})
	}
</script>

<theme>
	<main
		class="
			absolute top-0 left-0
			w-full h-full
			flex flex-col
			bg-sky-500 dark:bg-sky-600
			overflow-hidden
		"
	>
		<Header />

		<Pool />

		<slot />

		<Footer />

		<Konami />
	</main>
</theme>
