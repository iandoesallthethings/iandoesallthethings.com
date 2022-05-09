import { getDb } from '$lib/notion'

const projectsId = process.env.NOTION_PROJECTS_DB

const filter = { property: 'published', checkbox: { equals: true } }

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const projects = await getDb({ database_id: projectsId, filter })

	return {
		body: projects
	}
}
