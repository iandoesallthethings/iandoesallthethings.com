import fs from 'node:fs/promises'
import path from 'node:path'
import YAML from 'yaml'

const contentDir = path.resolve('content')

export interface Note {
	slug: string
	frontmatter: Record<string, unknown>
	body: string
}

export async function getNote(collection: string, slug: string): Promise<Note | undefined> {
	const filePath = path.join(contentDir, collection, slug + '.md')

	try {
		return parseNote(slug, await fs.readFile(filePath, 'utf-8'))
	} catch (error) {
		console.warn(`Skipping unreadable note ${collection}/${slug}:`, error)
		return undefined
	}
}

// Lenient by design: one broken note gets skipped with a warning, never a crash
export async function getCollection(collection: string): Promise<Note[]> {
	let filenames: string[] = []

	try {
		filenames = await fs.readdir(path.join(contentDir, collection))
	} catch (error) {
		console.warn(`Could not read content collection ${collection}:`, error)
	}

	const slugs = filenames.filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3))
	const notes = await Promise.all(slugs.map((slug) => getNote(collection, slug)))

	return notes.filter((note) => note !== undefined)
}

export async function listAttachments(): Promise<string[]> {
	try {
		return await fs.readdir(path.join(contentDir, 'attachments'))
	} catch (error) {
		console.warn('Could not read attachments:', error)
		return []
	}
}

export async function readAttachment(filename: string): Promise<Buffer | undefined> {
	// Resolve and re-check the prefix so `..` segments can't escape the attachments dir
	const attachmentsDir = path.join(contentDir, 'attachments')
	const filePath = path.resolve(attachmentsDir, filename)

	if (!filePath.startsWith(attachmentsDir + path.sep)) return undefined

	try {
		return await fs.readFile(filePath)
	} catch {
		return undefined
	}
}

function parseNote(slug: string, raw: string): Note {
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

// Frontmatter media paths like `../attachments/foo.png` become site URLs
export function attachmentUrl(value: unknown): string | undefined {
	if (typeof value !== 'string' || !value) return undefined

	return `/attachments/${encodeURIComponent(path.basename(value))}`
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
