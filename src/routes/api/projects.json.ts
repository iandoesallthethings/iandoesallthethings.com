import { getDb } from '$lib/notion'

const projectsId = process.env.NOTION_PROJECTS_DB

const filter = { property: 'published', checkbox: { equals: true } }

export async function get(): Promise<Partial<Response>> {
	const projects = await getDb({ database_id: projectsId, filter })

	return {
		body: projects
	}
}
