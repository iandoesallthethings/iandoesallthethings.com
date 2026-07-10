<script lang="ts">
	import '../app.postcss'
	import 'highlight.js/styles/github.css'
	import * as Analytics from '$lib/Analytics'
	import Header from '$components/Header.svelte'
	import Konami from '$components/Konami.svelte'
	import Footer from '$components/Footer.svelte'
	import Pool from '$ukiyo/Pool.svelte'

	Analytics.initialize()
</script>

<div
	class="
		backdrop absolute top-0 left-0
		w-[100dvw] h-[100dvh]
		z-0
	"
>
	<Pool />

	<Konami />
</div>

<Header />

<slot />

<Footer />

<style lang="postcss">
	:global(body) {
		@apply bg-sky-500 dark:bg-sky-600;
	}
</style>
