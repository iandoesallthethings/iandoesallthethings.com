import { getDb } from '$lib/notion'

const fieldsId = process.env.NOTION_FIELDS_DB

const sorts = [{ property: 'order', direction: 'ascending' }]
const filter = { property: 'published', checkbox: { equals: true } }

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	const fields = await getDb({ database_id: fieldsId, sorts, filter })

	return {
		body: [...fields, { name: 'all the things' }]
	}
}
