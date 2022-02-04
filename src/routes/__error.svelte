<script context="module">
	/** @type {import('@sveltejs/kit').ErrorLoad} */
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		}
	}
</script>

<script lang="ts">
	import Page from '$components/Page.svelte'
	export let title = ''
</script>

<Page>
	{title}
</Page>
