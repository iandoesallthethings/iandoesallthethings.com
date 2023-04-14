import * as Notion from '$db/notion'
const fieldsId = process.env.NOTION_FIELDS_DB

const sorts = [{ property: 'order', direction: 'ascending' }]
const filter = { property: 'published', checkbox: { equals: true } }

export async function getAll() {
	const fieldsFromNotion = await Notion.getDb({ database_id: fieldsId, sorts, filter })

	const allTheThings = { name: 'all the things' }

	return [...fieldsFromNotion, allTheThings]
}
