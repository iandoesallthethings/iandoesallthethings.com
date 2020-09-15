import App from './App.svelte'
import allProjects from './projects.js'

const fetchProjects = () => {
  // Pull from db or notion or whatever here! :D
  return allProjects
}

const app = new App({
  target: document.body,
  props: { allProjects: fetchProjects() },
})

export default app
