<script lang="ts">
	import focus from '$lib/focus'
	import { page } from '$app/stores'
</script>

<header
	class="
		absolute top-0
		flex flex-col justify-between
		sm:text-xl
		text-white/80
		text-opacity-80 text-lg
		backdrop-blur-sm rounded-rb-2xl
		pointer-events-none
		whitespace-nowrap
	"
>
	<div class="header-row pt-4">
		<h1 class="inline pr-2">ian edwards</h1>
		<span class="sm:hidden text-black/80">does</span>
	</div>

	<nav class="header-row flex gap-4">
		<span class="hidden sm:inline text-black/80">ian does</span>

		{#await $page.data.fields then fields}
			{#each fields as field}
				<label>
					<input
						type="radio"
						value={field.name}
						bind:group={$focus}
						on:click={() => ($focus = $focus)}
						class="hidden peer"
					/>

					<span
						class="
						cursor-pointer
						peer-checked:font-bold
						peer-checked:drop-shadow-lg"
					>
						{field.name}
					</span>
				</label>
			{/each}
		{/await}
	</nav>
</header>

<style lang="postcss">
	.header-row {
		@apply pointer-events-auto w-min min-w-fit pl-4;
	}
</style>
