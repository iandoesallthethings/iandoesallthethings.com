import * as Notion from '$db/Notion'
import type { NotionField } from '$types'
import { env } from '$env/dynamic/private'
import { allTheThings } from '$lib/Fields'

const database_id = env.NOTION_FIELDS_DB

const filter = Notion.filters.published()
const sorts = [Notion.sorts.ascending('order')]

export async function getAll(): Promise<NotionField[]> {
	const fieldsFromNotion: NotionField[] = await Notion.getDb({ database_id, filter, sorts })

	return [...fieldsFromNotion, allTheThings as NotionField]
}

export async function getPage(projectName: string): Promise<NotionField | undefined> {
	if (!projectName) return

	const filter = {
		and: [Notion.filters.propertyContains('route', projectName), Notion.filters.published()],
	}

	const { 0: project } = await Notion.getDb<NotionField>({ database_id, filter })

	if (!project) return

	return Notion.getPage(project)
}
