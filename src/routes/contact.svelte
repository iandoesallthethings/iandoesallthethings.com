<script lang="ts">
	import Page from '$components/Page.svelte'

	let copied

	const copyEmail = () => {
		const textArea = document.createElement('textarea')
		textArea.value = 'ianDoesAllTheThings@gmail.com'
		document.body.appendChild(textArea)
		textArea.select()
		document.execCommand('Copy')
		textArea.remove()
		flash(copied)
	}

	export const flash = (element) => {
		requestAnimationFrame(() => {
			element.style.transition = 'none'
			element.style.opacity = 1

			setTimeout(() => {
				element.style.transition = 'opacity 2s ease'
				element.style.opacity = 0
			})
		})
	}
</script>

<Page>
	<h2>Please don't hesitate to reach out!</h2>

	<p class="group">
		<a href="mailto:iandoesallthethings@gmail.com" target="_blank">
			<i class="far fa-envelope" />
			<span id="email">ianDoesAllTheThings@gmail.com</span>
		</a>
		<span on:click={copyEmail}>
			<i class="fas fa-clipboard opacity-0 group-hover:opacity-100 cursor-pointer" />
		</span>
		<span bind:this={copied} class="opacity-0 mx-5 border rounded-md p-2 text-xs">Copied! ❤️</span>
	</p>
	<p>
		<a href="https://www.instagram.com/iandoesallthethings/" target="_blank">
			<i class="fab fa-instagram" />
			<span>@ianDoesAllTheThings</span>
		</a>
	</p>
	<!-- <p>
		<a href="https://twitter.com/ianDATT" target="_blank">
			<i class="fab fa-twitter" />
			<span>@ianDATT</span>
		</a>
	</p> -->
	<p>
		<a href="https://github.com/iandoesallthethings" target="_blank">
			<i class="fab fa-github" />
			<span>ianDoesAllTheThings</span>
		</a>
	</p>
	<p>
		<a href="https://www.linkedin.com/in/ian-edwards-81920080/" target="_blank">
			<i class="fab fa-linkedin" />
			<span>Ian Edwards</span>
		</a>
	</p>
</Page>
