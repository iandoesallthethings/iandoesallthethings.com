<script>
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'
  import Bio from './Bio.svelte'
  import Role from './Role.svelte'
  import Footer from './Footer.svelte'
  import Contact from './Contact.svelte'
  import Konami from './Konami.svelte'
  import { darkMode } from './stores.js'

  export let allProjects
  // export let testPage

  let currentPage = null
  let video
  let paused

  // onMount(() => {
  //   paused = video.paused
  //   console.log(paused)
  // })

  $darkMode = JSON.parse(localStorage.getItem('darkMode')) || false

  const changePage = () => (currentPage = window.location.hash.substring(1))
  const updateHash = () => (window.location.hash = currentPage)

  const toggleVideo = () => {
    video.paused ? video.play() : video.pause()
    paused = video.paused
    console.log(video.paused)
  }

  const toggleDarkmode = () => {
    $darkMode = !$darkMode
    localStorage.setItem('darkMode', JSON.stringify($darkMode))
  }
</script>

<svelte:window on:load={changePage} on:hashchange={changePage} />

<!-- {@html testPage} -->

<div id="page">
  <aside on:click={toggleVideo}>
    <video
      src="images/saxloop.mp4"
      poster="images/saxloop-frame2.png"
      preload="images/saxloop-frame2.png"
      class="backgroundVideo {paused ? 'paused' : ''}"
      playsInline
      muted
      loop
      autoplay
      bind:this={video}
    />
  </aside>

  <content class:darkMode={$darkMode}>
    <Konami />
    <i
      id="themeToggle"
      class="{$darkMode ? 'fas' : 'far'} fa-lightbulb"
      title={$darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      on:click={toggleDarkmode}
    />

    <!-- 
      TODO: Move nav to component. This might require a store for current page 
      or sending a message back up from the component
    -->
    <nav>
      <input
        class="roleSelector"
        type="radio"
        value=""
        id="bio"
        bind:group={currentPage}
        on:change={updateHash}
      />
      <label for="bio">ian</label>
      <div class="spacer" />
      {#each Object.entries(allProjects) as [role, projects]}
        <input
          class="roleSelector"
          type="radio"
          id={role}
          value={role}
          bind:group={currentPage}
          on:change={updateHash}
        />
        <label for={role}>{role}</label>
      {/each}
      <div class="spacer" />
      <input
        class="roleSelector"
        type="radio"
        value="contact"
        id="contact"
        bind:group={currentPage}
        on:change={updateHash}
      />
      <label for="contact">get in touch</label>
    </nav>

    <hr />

    <main>

      <h4 class:visible={currentPage in allProjects}>ian is a</h4>

      <!-- 
        TODO: See if using a slot would work here. I'm not sure how to handle
        passing different components AND different data.
        Look into Component Bindings, 
      -->
      <h1>{currentPage || 'Hello'}</h1>
      {#if currentPage in allProjects}
        <Role role={allProjects[currentPage]} />
      {:else if currentPage === 'contact'}
        <Contact />
      {:else}
        <Bio />
      {/if}

    </main>

    <Footer />
  </content>

</div>

<style>
  /* Layout */
  #page {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 300px auto;
  }

  /* Obi */
  aside {
    background-image: url(/images/saxloop-frame2.png);
    background-size: cover;
    background-position: -90%;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
  .backgroundVideo {
    height: 100vh;
    position: absolute;
    left: 50%;
    top: 50%;
    /* transform: translate(-38%, -50%); */
    transform: translate(-50%, -50%);
    /* cursor: pointer; */
    /* display: none; */
  }
  .paused {
    display: none;
  }

  /* Navigation */
  nav {
    font-size: small;
    align-self: start;
    color: var(--mainAccentColor);
  }
  input[type='radio'] {
    display: none;
  }
  input[type='radio'] + label {
    cursor: pointer;
  }
  input[type='radio']:checked + label::after {
    content: ' ·';
  }
  .spacer {
    height: 5px;
  }

  hr {
    width: 50%;
    justify-self: left;
    border: 0;
    padding-top: 1px;
    background-image: linear-gradient(
      to right,
      var(--mainAccentColor),
      transparent
    );
    margin: 24px 0px;
  }
  /* Main */
  content {
    padding: 0.5em 1em;
    overflow-y: scroll;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    color: var(--lightText);
    background: radial-gradient(
      farthest-corner at 0 0,
      var(--lightBg1),
      var(--lightBg2)
    );
    transition: 0.2s ease;
  }
  .darkMode {
    color: var(--darkText);
    background: radial-gradient(
      farthest-corner at 0 0,
      var(--darkBg1),
      var(--darkBg2)
    );
    transition: 0.2s ease;
    /* Background Transition: https://css-tricks.com/transitioning-gradients */
  }
  main {
    max-width: 930px;
    /* margin: auto; */
  }

  /* Page Titles */
  h1 {
    font-size: 4em;
  }
  h4 {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    margin-top: 0;
  }
  h4.visible {
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
  }

  #themeToggle {
    position: absolute;
    top: 1em;
    right: 1em;
    cursor: pointer;
    transition: 0.2s ease;
  }
  #themeToggle:hover {
    color: var(--mainAccentColor);
    transition: 0.2s ease;
  }

  /* Mobile View */
  @media (max-width: 720px) {
    #page {
      grid-template-columns: 100px auto;
    }
    aside {
      background-position: -68%;
    }
    h1 {
      font-size: 3em;
    }
  }
</style>
