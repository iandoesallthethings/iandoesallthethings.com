<script lang="ts">
	let video
	let paused

	function toggleVideo() {
		video.paused ? video.play() : video.pause()
		paused = video.paused
	}
</script>

<aside on:click={toggleVideo}>
	<video
		src="images/saxloop.mp4"
		poster="images/saxloop-frame2.png"
		preload="images/saxloop-frame2.png"
		class:paused
		playsInline
		muted
		loop
		autoplay
		bind:this={video}
	/>
</aside>

<style lang="postcss">
	aside {
		@apply z-50 relative bg-cover w-52 h-full flex justify-center items-center overflow-hidden shadow-md cursor-pointer;
		background-image: url(/images/saxloop-frame2.png);
		background-position: -90%;
	}

	.backgroundVideo {
		@apply absolute h-full;
	}

	.paused {
		@apply hidden;
	}
</style>
