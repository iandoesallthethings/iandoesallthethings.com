import * as Notion from '$db/Notion'
import type { Page, NotionProject } from '$types'
import { env } from '$env/dynamic/private'

const database_id = env.NOTION_PROJECTS_DB

const filter = Notion.filters.published()

export async function getAllPages(): Promise<Page<NotionProject>[]> {
	return Notion.getDbWithPage<NotionProject>({ database_id, filter })
}

export async function getAll(): Promise<NotionProject[]> {
	return Notion.getDb({ database_id, filter })
}

export async function getPage(projectName: string): Promise<Page<NotionProject> | undefined> {
	if (!projectName) return

	const filter = {
		and: [Notion.filters.propertyContains('route', projectName), Notion.filters.published()],
	}

	const { 0: project } = await Notion.getDb<NotionProject>({ database_id, filter })

	if (!project) return

	return Notion.getPage(project)
}
