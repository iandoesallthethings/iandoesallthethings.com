<script>
  import { darkMode } from './stores.js'

  export let project
</script>

<figure>
  <a
    href={project.link}
    class="projectBox {$darkMode ? 'darkMode' : ''}"
    target="_blank"
  >
    {#if project.video}
      <video
        class="projectVideo"
        src={project.video}
        alt={project.title}
        autoplay
        muted
        loop
        playsInline
      />
    {:else}
      <img
        class="projectImage"
        src={project.image || 'images/maybe.gif'}
        alt={project.title}
      />
    {/if}
    <div class="projectLabel">{project.title}</div>
  </a>
</figure>

<style>
  .projectBox {
    display: block;
    width: 100%;
    max-width: 200px;
    min-width: 150px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
    background: var(--lightBg1);
    transition: 0.2s ease;
  }
  .darkMode {
    background: var(--darkBg1);
    transition: 0.2s ease;
  }
  .projectBox:hover {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.4);
    transition: 100ms ease;
  }
  .projectVideo,
  .projectImage {
    width: 100%;
    /* max-width: 200px;
    min-width: 150px; */
  }
  .projectLabel {
    padding: 3px;
    font-weight: normal;
  }
</style>
