import * as Content from '$db/Content'
import { error } from '@sveltejs/kit'

export const prerender = true

const mimeTypes: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	svg: 'image/svg+xml',
	webp: 'image/webp',
	mp4: 'video/mp4',
	webm: 'video/webm',
	mp3: 'audio/mpeg',
	pdf: 'application/pdf',
}

export async function entries() {
	const filenames = await Content.listAttachments()

	return filenames.map((path) => ({ path }))
}

export async function GET({ params }) {
	const filename = decodeURIComponent(params.path)
	const file = await Content.readAttachment(filename)

	if (!file) throw error(404, `Could not find attachment: ${filename}`)

	const extension = filename.split('.').pop()?.toLowerCase() ?? ''

	return new Response(new Uint8Array(file), {
		headers: {
			'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	})
}
