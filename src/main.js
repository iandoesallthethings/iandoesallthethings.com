import App from './App.svelte'
import allProjects from './projects.js'

// Potion Endpoints
// https://potion-api.now.sh/html?id=:id
// https://potion-api.now.sh/table?id=:id
// https://potion-api.now.sh/table-description?id=:id

const preload = async () => {
  // const response = await fetch(
  //   'https://potion-api.now.sh/html?id=b9469cf4c6a244b3aa58be8dd3996467'
  // )

  // const text = await response.text()

  return new App({
    target: document.body,
    // props: { allProjects, testPage: text },
    props: { allProjects },
  })
}

export default preload()
