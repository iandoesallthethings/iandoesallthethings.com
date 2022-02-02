const fetch = require('node-fetch')

const potionTable = 'https://potion-api.now.sh/table?id='
const potionHtml = 'https://potion-api.now.sh/html?id='

const pagesTable = '7d9f3578b611413e87381a060c4e7c4c'
const projectsTable = '4ea40b355abe429ea1cd4d352578a9d8'

const getNotion = async () => {
  // get pages
  const pagesResponse = await fetch(potionTable + pagesTable)
  const pageData = JSON.parse(await pagesResponse.text())

  const pagePromises = pageData.map((page) => fetch(potionHtml + page.id))
  const pageResponses = await Promise.all(pagePromises)
  const pages = pageResponses.map((pageResponse) => pageResponse.text())
  const pagesHtml = await Promise.all(pages)

  console.log(await pages)

  // get projects
  const projectsResponse = await fetch(potionTable + projectsTable)
  const projects = JSON.parse(await projectsResponse.text())
}

getNotion()
