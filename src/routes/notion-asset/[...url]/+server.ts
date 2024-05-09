import * as S3 from '$db/S3'

// export const prerender = true

export async function GET({ params, fetch }) {
	const slug = params.url
	console.debug('slug:', slug)

	return S3.getCache(slug, fetch)
}
