<script lang="ts">
	import DarkModeSwitch from '$components/DarkModeSwitch.svelte'
	import { focus } from '$lib/stores'
	import float from '$lib/float'

	let fields = ['development', 'music', 'education']
	let header
</script>

<header>
	<h1>ian edwards</h1>
	<nav>
		<span>ian does</span>
		{#each fields as field}
			<label>
				<input
					type="radio"
					value={field}
					bind:group={$focus}
					on:click={() => ($focus = $focus)}
					class="hidden"
				/>
				<span> {field} </span>
			</label>
		{/each}
		<!-- <DarkModeSwitch /> -->
	</nav>
</header>

<style>
	header {
		@apply p-2 absolute top-0 left-0 z-50;
	}

	nav {
		@apply flex justify-between w-full min-w-fit text-xl space-x-4 m-2 whitespace-nowrap;
	}

	input + span {
		@apply text-xl cursor-pointer text-white px-2 py-1;
	}
	input:hover + span {
		@apply bg-white bg-opacity-10 rounded-md shadow-sm;
	}
	input:checked + span {
		@apply font-bold;
	}
</style>
