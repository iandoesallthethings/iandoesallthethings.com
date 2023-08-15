// Rendering https://s3.us-west-2.amazonaws.com/secure.notion-static.com/26a1ba29-164d-4a04-baa2-c2c1b6c03d54/santoka.png
// ?X-Amz-Algorithm=AWS4-HMAC-SHA256
// &X-Amz-Content-Sha256=UNSIGNED-PAYLOAD
// &X-Amz-Expires=3600
// &X-Amz-Credential=AKIAT73L2G45EIPT3X45/20230813/us-west-2/s3/aws4_request
// &X-Amz-Date=20230813T004707Z
// &X-Amz-Signature=c618aac3fb543bf0e235da5b24ff304bfe7a4d0fdede751d950fd918e1e60c73
// &X-Amz-SignedHeaders=host
// &x-id=GetObject

import { error } from '@sveltejs/kit'

type Slug = string
type S3Url = string

export const cache = new Map<Slug, { url: S3Url; response?: Response | Promise<Response> }>()

export async function getCache(slug: string, sveltekitFetch?: typeof fetch) {
	let { url, response } = cache.get(slug) ?? {}

	if (!url) throw error(404, `Could not find asset: ${slug}`)

	if (response) {
		console.log('Cache hit:', slug)
		return response
	}

	console.log('Cache miss. Fetching:', slug)

	response = (sveltekitFetch || fetch)(url)

	setCache(url, response)

	return response
}

export function setCache(url: S3Url, response?: Response | Promise<Response>): Slug {
	const { key, fileName } = extractFromUrl(url)

	const slug = key + '-' + fileName

	cache.set(slug, { url, response })

	return slug
}

const delimiter = ':'
export function reconstructUrl(urlParts: string) {
	const [date, credential, signature, key, fileName] = decodeURIComponent(urlParts).split(delimiter)
	console.debug('Rendering', fileName)

	const root = 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/'
	const params =
		'?' +
		[
			'X-Amz-Algorithm=AWS4-HMAC-SHA256',
			'X-Amz-Content-Sha256=UNSIGNED-PAYLOAD',
			'X-Amz-Expires=3600',
			'X-Amz-SignedHeaders=host',
			'x-id=GetObject',
			`X-Amz-Credential=${credential}`,
			`X-Amz-Date=${date}`,
			`X-Amz-Signature=${signature}`,
		].join('&')

	return root + key + '/' + fileName + params
}

export function extractFromUrl(s3Url: string) {
	const url = new URL(s3Url)

	const pathSegments = url.pathname.split('/')
	const key = pathSegments[pathSegments.indexOf('secure.notion-static.com') + 1]
	const fileName = pathSegments[pathSegments.indexOf('secure.notion-static.com') + 2]

	const queryParameters = url.searchParams
	const credential = queryParameters.get('X-Amz-Credential')
	const date = queryParameters.get('X-Amz-Date')
	const signature = queryParameters.get('X-Amz-Signature')

	// 26a1ba29-164d-4a04-baa2-c2c1b6c03d54
	// santoka.png
	// 20230813T004707Z // date
	// c618aac3fb543bf0e235da5b24ff304bfe7a4d0fdede751d950fd918e1e60c73 // signature
	// AKIAT73L2G45EIPT3X45/20230813/us-west-2/s3/aws4_request // credential
	const slug = encodeURIComponent([date, credential, signature, key, fileName].join(delimiter))

	return { key, fileName, slug }
}
