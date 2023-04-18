<script lang="ts">
	import Page from '$components/Page.svelte'
	import { page } from '$app/stores'

	const errorText: Record<number, string> = {
		404: "404'd!",
		500: "ERROR'D",
	}

	$: message = errorText[$page.status] || errorText[500]
</script>

<Page>
	<h1>{message}</h1>

	<img src="images/404d.png" alt="404'd!" class="rounded-lg my-2" />
</Page>
