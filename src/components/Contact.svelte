<script>
  import { flash } from './helpers.js'

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
</script>

<p>Please don't hesitate to reach out!</p>

<section>
  <p>
    <a href="#contact" on:click={copyEmail}>
      <i class="far fa-envelope" />
      <span id="email">ianDoesAllTheThings@gmail.com</span>
      <span id="copied" bind:this={copied}>Copied! ❤️</span>
    </a>
  </p>
  <p>
    <a href="https://www.instagram.com/iandoesallthethings/">
      <i class="fab fa-instagram" />
      <span>@ianDoesAllTheThings</span>
    </a>
  </p>
  <p>
    <a href="https://twitter.com/ianDATT">
      <i class="fab fa-twitter" />
      <span>@ianDATT</span>
    </a>
  </p>
  <p>
    <a href="https://github.com/iandoesallthethings">
      <i class="fab fa-github" />
      <span>ianDoesAllTheThings</span>
    </a>
  </p>
  <p>
    <a href="https://www.linkedin.com/in/ian-edwards-81920080/">
      <i class="fab fa-linkedin" />
      <span>Ian Edwards</span>
    </a>
  </p>
</section>

<style>
  section {
    padding-left: 1em;
    /* font-size: small; */
  }

  i {
    padding-right: 5px;
  }

  #email::after {
    margin-left: 5px;
    font-family: 'Font Awesome 5 Free';
    content: '\f0c5';
    visibility: hidden;
    white-space: nowrap;
  }
  #email:hover::after {
    visibility: visible;
  }

  #copied {
    opacity: 0;
    margin-left: 5px;
    border: 1px var(--mainAccentColor) solid;
    border-radius: 2px;
    padding: 2px;
    font-size: xx-small;
  }
  /* Mobile View */
  @media (max-width: 720px) {
    #copied {
      /* font-size: xx-small; */
      position: relative;
    }
    section {
      font-size: small;
      line-height: 2em;
    }
  }
</style>
