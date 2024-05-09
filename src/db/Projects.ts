import * as Notion from '$db/Notion'
import type { Page, Project } from '$types'
import { NOTION_PROJECTS_DB } from '$env/static/private'

const database_id = NOTION_PROJECTS_DB

const filter = Notion.filters.published()

export async function getAllPages(): Promise<Page<Project>[]> {
	return Notion.getDbWithPage<Project>({ database_id, filter })
}

export async function getAll(): Promise<Project[]> {
	return Notion.getDb({ database_id, filter })
}

export async function getPage(projectName: string): Promise<Page<Project> | undefined> {
	if (!projectName) return

	const filter = {
		and: [Notion.filters.propertyContains('route', projectName), Notion.filters.published()],
	}

	const { 0: project } = await Notion.getDb<Project>({ database_id, filter })

	if (!project) return

	return Notion.getPage(project)
}
