import * as Content from '$db/Content'
import type { Note } from '$db/Content'
import type { Field } from '$types'

export async function getAll(): Promise<Field[]> {
	const notes = await Content.getCollection('fields')

	const fields = notes.map(toField).filter((field) => field.published)

	const allTheThings: Field = {
		id: 'all the things',
		name: 'all the things',
		order: fields.length,
		published: true,
	}

	return [...fields, allTheThings].sort((a, b) => a.order - b.order)
}

function toField(note: Note): Field {
	const { frontmatter: fm, slug } = note

	return {
		id: slug,
		name: String(fm.name ?? slug),
		blurb: typeof fm.blurb === 'string' ? fm.blurb : undefined,
		order: Number(fm.order ?? 99),
		published: Content.asBoolean(fm.published),
	}
}
