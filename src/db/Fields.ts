import * as Notion from '$db/Notion'
import type { Field } from '$types'
import { env } from '$env/dynamic/private'

const database_id = env.NOTION_FIELDS_DB

const filter = Notion.filters.published()
const sorts = [Notion.sorts.ascending('order')]

export async function getAll(): Promise<Field[]> {
	const fieldsFromNotion: Field[] = await Notion.getDb({ database_id, filter, sorts })

	const allTheThings: Field = {
		id: 'all the things',
		name: 'all the things',
		order: 4,
		published: true,
	}

	return [...fieldsFromNotion, allTheThings]
}

export async function getPage(projectName: string): Promise<Field | undefined> {
	if (!projectName) return

	const filter = {
		and: [Notion.filters.propertyContains('route', projectName), Notion.filters.published()],
	}

	const { 0: project } = await Notion.getDb<Field>({ database_id, filter })

	if (!project) return

	return Notion.getPage(project)
}
