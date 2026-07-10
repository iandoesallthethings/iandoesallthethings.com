import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from '@flowershow/remark-wiki-link'
import remarkCallout from '@r4ai/remark-callout'
import remarkRehype from 'remark-rehype'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import type { HtmlString } from '$types'

export interface RenderOptions {
	// Where Obsidian embeds (`![[file.png]]`) point; defaults to the local attachments route
	attachmentUrl?: (filename: string) => string
}

function defaultAttachmentUrl(filename: string) {
	return `/attachments/${encodeURIComponent(filename)}`
}

const schema = {
	...defaultSchema,
	tagNames: [...(defaultSchema.tagNames ?? []), 'video', 'audio', 'source', 'figure', 'figcaption'],
	attributes: {
		...defaultSchema.attributes,
		'*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'data*'],
		video: ['src', 'controls', 'autoPlay', 'muted', 'loop', 'playsInline', 'width', 'height'],
		audio: ['src', 'controls'],
		source: ['src', 'type'],
	},
}

function processor(attachmentUrl: (filename: string) => string) {
	function urlResolver({ filePath, heading, isEmbed }: UrlResolverOptions) {
		if (isEmbed) return attachmentUrl(filePath)

		const anchor = heading ? `#${heading}` : ''

		return `/${filePath}${anchor}`
	}

	return unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkWikiLink, { urlResolver })
		.use(remarkCallout)
		.use(remarkRehype)
		.use(rehypeSanitize, schema)
		.use(rehypeHighlight)
		.use(rehypeStringify)
}

interface UrlResolverOptions {
	filePath: string
	heading: string
	isEmbed: boolean
}

export async function toHtml(markdown: string, options: RenderOptions = {}): Promise<HtmlString> {
	const render = processor(options.attachmentUrl ?? defaultAttachmentUrl)

	return String(await render.process(markdown))
}

// For one-liners rendered inside an existing block element (e.g. field blurbs):
// unwraps the surrounding <p> so the result can nest anywhere
export async function toInlineHtml(
	markdown: string,
	options: RenderOptions = {}
): Promise<HtmlString> {
	const html = (await toHtml(markdown, options)).trim()
	const match = html.match(/^<p>([\s\S]*)<\/p>$/)

	if (match && !match[1].includes('<p')) return match[1]

	return html
}
