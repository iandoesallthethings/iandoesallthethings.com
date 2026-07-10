import { building, dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import * as filesystem from '$db/sources/filesystem'
import * as github from '$db/sources/github'
import type { Note } from '$db/Note'

export interface ContentSource {
	getCollection(collection: string): Promise<Note[]>
	getNote(collection: string, slug: string): Promise<Note | undefined>
	attachmentUrl(filename: string): string
}

// Dev and build-time prerendering read the working tree; deployed serverless
// renders fetch from GitHub so content updates never require a build.
function mode(): 'filesystem' | 'github' {
	if (env.CONTENT_SOURCE === 'filesystem' || env.CONTENT_SOURCE === 'github') {
		return env.CONTENT_SOURCE
	}

	if (dev || building) return 'filesystem'

	return env.VERCEL ? 'github' : 'filesystem'
}

export async function open(): Promise<ContentSource> {
	return mode() === 'github' ? github.open() : filesystem.open()
}
