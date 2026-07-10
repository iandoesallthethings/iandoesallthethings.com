import fs from 'node:fs/promises'
import path from 'node:path'
import { parseNote, type Note } from '$db/Note'
import type { ContentSource } from '$db/Content'

const contentDir = path.resolve('content')

async function getNote(collection: string, slug: string): Promise<Note | undefined> {
	const filePath = path.join(contentDir, collection, slug + '.md')

	try {
		return parseNote(slug, await fs.readFile(filePath, 'utf-8'))
	} catch (error) {
		console.warn(`Skipping unreadable note ${collection}/${slug}:`, error)
		return undefined
	}
}

// Lenient by design: one broken note gets skipped with a warning, never a crash
async function getCollection(collection: string): Promise<Note[]> {
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

function attachmentUrl(filename: string): string {
	return `/attachments/${encodeURIComponent(filename)}`
}

export function open(): ContentSource {
	return { getCollection, getNote, attachmentUrl }
}

// Used by the /attachments route, which only serves in dev and local preview builds
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
