import * as Content from '$db/Content'
import * as Markdown from '$db/Markdown'
import { asBoolean, asList, attachmentFilename, type Note } from '$db/Note'
import type { ContentSource } from '$db/Content'
import type { Page, Project } from '$types'

export async function getAll(): Promise<Project[]> {
	const source = await Content.open()
	const notes = await source.getCollection('projects')

	return notes.map((note) => toProject(note, source)).filter((project) => project.published)
}

export async function getPage(projectName: string): Promise<Page<Project> | undefined> {
	if (!projectName) return

	const source = await Content.open()
	const note = await source.getNote('projects', projectName)

	if (!note) return

	const project = toProject(note, source)

	if (!project.published) return

	const page = await Markdown.toHtml(note.body, { attachmentUrl: source.attachmentUrl })

	return { ...project, page }
}

function toProject(note: Note, source: ContentSource): Project {
	const { frontmatter: fm, slug } = note

	const image = attachmentFilename(fm.image)
	const video = attachmentFilename(fm.video)

	return {
		id: slug,
		route: slug,
		name: String(fm.name ?? slug),
		subtitle: String(fm.subtitle ?? ''),
		fields: asList(fm.fields),
		link: typeof fm.link === 'string' ? fm.link : undefined,
		image: image && source.attachmentUrl(image),
		video: video && source.attachmentUrl(video),
		published: asBoolean(fm.published),
		indev: asBoolean(fm.indev),
	}
}
