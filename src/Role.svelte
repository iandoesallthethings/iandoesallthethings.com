<script>
  import marked from 'marked'
  import Project from './Project.svelte'
  export let role
</script>

<section>
  {@html marked(role.description)}
  {#if role.extra}
    {@html role.extra}
  {/if}
  <figure>
    {#each role.projects as project}
      {#if project.display}
        <Project {project} />
      {/if}
    {/each}
  </figure>
</section>

<style>
  figure {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }
</style>
