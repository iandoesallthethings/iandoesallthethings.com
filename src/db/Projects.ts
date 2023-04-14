import * as Notion from '$db/notion'

const projectsId = process.env.NOTION_PROJECTS_DB

export async function getAll() {
	const filter = { property: 'published', checkbox: { equals: true } }

	return await Notion.getDb({ database_id: projectsId, filter })
}

export async function getPage(projectName: string) {
	const filter = {
		and: [
			{ property: 'route', rich_text: { contains: projectName } },
			{ property: 'published', checkbox: { equals: true } },
		],
	}

	const { 0: project } = await Notion.getDb({ database_id: projectsId, filter })

	if (!project) return

	return await Notion.getPage(project)
}
