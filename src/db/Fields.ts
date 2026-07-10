import * as Content from '$db/Content'
import * as Markdown from '$db/Markdown'
import { asBoolean, type Note } from '$db/Note'
import type { Field } from '$types'

export async function getAll(): Promise<Field[]> {
	const source = await Content.open()
	const notes = await source.getCollection('fields')

	const fields = (await Promise.all(notes.map(toField))).filter((field) => field.published)

	const allTheThings: Field = {
		id: 'all the things',
		name: 'all the things',
		order: fields.length,
		published: true,
	}

	return [...fields, allTheThings].sort((a, b) => a.order - b.order)
}

async function toField(note: Note): Promise<Field> {
	const { frontmatter: fm, slug } = note

	return {
		id: slug,
		name: String(fm.name ?? slug),
		blurb: typeof fm.blurb === 'string' ? await Markdown.toInlineHtml(fm.blurb) : undefined,
		order: Number(fm.order ?? 99),
		published: asBoolean(fm.published),
	}
}
