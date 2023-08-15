import * as S3 from '$db/S3'
import { error } from '@sveltejs/kit'
import sharp from 'sharp'
// import ffmpeg from 'fluent-ffmpeg'
// import { Readable } from 'node:stream'

export const prerender = true

export async function GET({ params, fetch }) {
	const { slug } = params

	const type = fileType(slug)

	// Here's where I could resize the asset and re-cache it
	let { url, response } = await S3.getCache(slug, fetch)

	if (type == 'image') {
		let resizedResponse = await resize(type, response)

		S3.setCache(url, resizedResponse)
		return resizedResponse
	}

	return response
}

async function resize(type: 'image' | 'video', response: Response | Promise<Response>) {
	response = await response
	switch (type) {
		case 'image':
			const buffer = await response.arrayBuffer()
			const image = await sharp(buffer)
			return new Response(await image.resize(256).toBuffer())
		case 'video':
			// const body = await response.body
			// if (!body) throw error(500, 'No stream')
			// const stream = new Readable().push()
			// const f = ffmpeg(stream)
			console.log('Video resizing not implemented yet.')
			return response
	}
}

function fileType(fileName: string): 'image' | 'video' {
	const extension = fileName.split('.').pop()

	switch (extension) {
		case 'jpg' || 'jpeg' || 'png' || 'gif':
			return 'image'
		case 'mp4' || 'webm' || 'ogg':
			return 'video'
		default:
			throw error(500, 'Unsupported file type')
	}
}
