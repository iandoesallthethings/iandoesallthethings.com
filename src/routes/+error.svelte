<script lang="ts">
	import Page from '$components/Page.svelte'
	import { page } from '$app/stores'

	const errors = {
		404: "404'd!",
		default: "ERROR'D",
	}

	$: message = errors[$page.status] || errors.default
</script>

<Page>
	<h1>{message}</h1>

	<img src="images/404d.png" alt="404'd!" class="rounded-lg my-2" />
</Page>
