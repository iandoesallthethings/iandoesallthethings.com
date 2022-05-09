import { getDb, getDbWithPages } from '$lib/notion'
import type { Db } from '$lib/types'

const fieldsId = process.env.NOTION_FIELDS_DB
const projectsId = process.env.NOTION_PROJECTS_DB

const sorts = [{ property: 'order', direction: 'ascending' }]
const filter = { property: 'published', checkbox: { equals: true } }

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const fields = await getDb({ database_id: fieldsId, sorts, filter })
	const projects = await getDbWithPages({ database_id: projectsId, filter })

	return {
		body: {
			fields: [...(await Promise.all(fields)), { name: 'all the things' }],
			projects: await Promise.all(projects)
		} as Db
	}
}
