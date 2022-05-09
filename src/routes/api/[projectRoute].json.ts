import { getDb, getPage } from '$lib/notion'

const projectsId = process.env.NOTION_PROJECTS_DB

/** @type {import('./[projectRoute]').RequestHandler} */
export async function get({ params }) {
	const filter = {
		and: [
			{ property: 'route', rich_text: { contains: params.projectRoute } },
			{ property: 'published', checkbox: { equals: true } }
		]
	}

	const projects = await getDb({ database_id: projectsId, filter })
	const projectWithPage = await getPage(projects[0])

	return { body: projectWithPage }
}
