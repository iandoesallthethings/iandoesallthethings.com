import * as Content from '$db/Content'
import * as Markdown from '$db/Markdown'
import type { Note } from '$db/Content'
import type { Page, Project } from '$types'

export async function getAll(): Promise<Project[]> {
	const notes = await Content.getCollection('projects')

	return notes.map(toProject).filter((project) => project.published)
}

export async function getPage(projectName: string): Promise<Page<Project> | undefined> {
	if (!projectName) return

	const note = await Content.getNote('projects', projectName)

	if (!note) return

	const project = toProject(note)

	if (!project.published) return

	return { ...project, page: await Markdown.toHtml(note.body) }
}

function toProject(note: Note): Project {
	const { frontmatter: fm, slug } = note

	return {
		id: slug,
		route: slug,
		name: String(fm.name ?? slug),
		subtitle: String(fm.subtitle ?? ''),
		fields: Content.asList(fm.fields),
		link: typeof fm.link === 'string' ? fm.link : undefined,
		image: Content.attachmentUrl(fm.image),
		video: Content.attachmentUrl(fm.video),
		published: Content.asBoolean(fm.published),
		indev: Content.asBoolean(fm.indev),
	}
}
