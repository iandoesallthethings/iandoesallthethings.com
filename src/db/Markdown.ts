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

// Obsidian embeds (`![[file.png]]`) and links (`[[note]]`) resolve here
function urlResolver({ filePath, heading, isEmbed }: UrlResolverOptions) {
	const anchor = heading ? `#${heading}` : ''

	if (isEmbed) return `/attachments/${filePath}`

	return `/${filePath}${anchor}`
}

interface UrlResolverOptions {
	filePath: string
	heading: string
	isEmbed: boolean
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

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkWikiLink, { urlResolver })
	.use(remarkCallout)
	.use(remarkRehype)
	.use(rehypeSanitize, schema)
	.use(rehypeHighlight)
	.use(rehypeStringify)

export async function toHtml(markdown: string): Promise<HtmlString> {
	return String(await processor.process(markdown))
}
