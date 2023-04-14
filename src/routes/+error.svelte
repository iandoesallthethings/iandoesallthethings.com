<script lang="ts">
	import Page from '$components/Page.svelte'
	import { page } from '$app/stores'
</script>

<Page>
	{#if $page.status === 404}
		<h1>404'd!</h1>

		<img src="images/404d.png" alt="404'd!" class="rounded-lg my-2" />
	{:else}
		<h1>{$page.status}: {$page.error?.message}</h1>
	{/if}
</Page>
