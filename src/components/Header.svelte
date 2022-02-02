<script lang="ts">
	import DarkModeSwitch from '$components/DarkModeSwitch.svelte'
	import { focus } from '$lib/stores'
	import { fade } from 'svelte/transition'

	let header

	let fields = [
		{
			name: 'development',
			description:
				'Founding member of Hyperbloom.ai specializing in full-stack web dev and wonky art stuff.'
		},
		{
			name: 'music',
			description:
				'Saxophonist, synth enthusiast, and member of the psychedelic dance act Partials.'
		},
		{
			name: 'education',
			description:
				'Private music teacher with Bachelor of Music in Music Education from the University of Georgia.'
		}
	]

	function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`)
		}

		const text = node.textContent
		const duration = text.length / (speed * 0.01)

		return {
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t)
				node.textContent = text.slice(0, i)
			}
		}
	}
</script>

<header>
	<div>
		<h1>ian edwards</h1>
		<nav>
			<span class="text-gray-700">ian does</span>
			{#each fields as field}
				<label>
					<input
						type="radio"
						value={field.name}
						bind:group={$focus}
						on:click={() => ($focus = $focus)}
						class="hidden"
					/>
					<span> {field.name} </span>
				</label>
			{/each}
			<!-- <DarkModeSwitch /> -->
		</nav>
	</div>

	<div class="w-full flex justify-center items-center">
		{#key $focus}
			<div class="blurb" in:typewriter={{ speed: 5 }}>
				{fields.find((field) => field.name === $focus).description}
			</div>
		{/key}
	</div>
</header>

<style>
	header {
		@apply w-full p-2 space-y-2 mt-2 mx-5 flex flex-row;
	}

	nav {
		@apply flex justify-between w-full min-w-fit text-xl space-x-4 whitespace-nowrap;
	}

	.blurb {
		@apply flex justify-center text-center rounded-xl shadow-lg bg-sky-400 bg-opacity-50 p-5 max-w-prose;
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
