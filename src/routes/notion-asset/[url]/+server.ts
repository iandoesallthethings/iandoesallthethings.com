import { error } from '@sveltejs/kit'
import * as S3 from '$db/S3'

export const prerender = true

export async function GET({ params, fetch }) {
	const s3Url = S3.reconstructUrl(params.url)

	if (!s3Url) throw error(404, `Could not find asset: ${s3Url}`)

	return fetch(s3Url)
}
