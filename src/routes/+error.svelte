<script lang="ts">
	import Page from '$components/Page.svelte'
	import { page } from '$app/stores'
</script>

<Page>
	<h1>{$page.status}: {$page.error?.message}</h1>
</Page>
