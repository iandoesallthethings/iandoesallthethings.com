import * as Notion from '$db/notion'
import type { Field } from '$types'
const fieldsId = process.env.NOTION_FIELDS_DB

const sorts = [{ property: 'order', direction: 'ascending' }]
const filter = { property: 'published', checkbox: { equals: true } }

export async function getAll(): Promise<Field[]> {
	const fieldsFromNotion: Field[] = await Notion.getDb({ database_id: fieldsId, sorts, filter })

	const allTheThings = { name: 'all the things' } as Field

	return [...fieldsFromNotion, allTheThings]
}

export async function getPage(projectName: string): Promise<Field | undefined> {
	if (!projectName) return

	const filter = {
		and: [
			{ property: 'route', rich_text: { contains: projectName } },
			{ property: 'published', checkbox: { equals: true } },
		],
	}

	const { 0: project } = await Notion.getDb<Field>({ database_id: fieldsId, filter })

	if (!project) return

	return Notion.getPage(project)
}
