import YAML from 'yaml'

export interface Note {
	slug: string
	frontmatter: Record<string, unknown>
	body: string
}

export function parseNote(slug: string, raw: string): Note {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

	if (!match) return { slug, frontmatter: {}, body: raw }

	let frontmatter: Record<string, unknown> = {}

	try {
		frontmatter = YAML.parse(match[1]) ?? {}
	} catch (error) {
		console.warn(`Bad frontmatter in ${slug}.md, treating as empty:`, error)
	}

	return { slug, frontmatter, body: match[2].trim() }
}

// Frontmatter media values look like `../attachments/foo.png` — reduce to the filename
export function attachmentFilename(value: unknown): string | undefined {
	if (typeof value !== 'string' || !value) return undefined

	return value.split('/').pop()
}

export function asBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value

	return String(value).toLowerCase() === 'yes' || String(value).toLowerCase() === 'true'
}

export function asList(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String)
	if (typeof value === 'string') return value.split(',').map((s) => s.trim())

	return []
}
