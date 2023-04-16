import * as Notion from '$db/notion'
import type { Project } from '$types'

const projectsId = process.env.NOTION_PROJECTS_DB

export async function getAll(): Promise<Project[]> {
	const filter = { property: 'published', checkbox: { equals: true } }

	return Notion.getDb({ database_id: projectsId, filter })
}

export async function getPage(projectName: string): Promise<Project | undefined> {
	if (!projectName) return

	const filter = {
		and: [
			{ property: 'route', rich_text: { contains: projectName } },
			{ property: 'published', checkbox: { equals: true } },
		],
	}

	const { 0: project } = await Notion.getDb<Project>({ database_id: projectsId, filter })

	if (!project) return

	return Notion.getPage(project)
}
