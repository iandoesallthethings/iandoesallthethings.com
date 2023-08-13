import type {
	QueryDatabaseParameters,
	CSSClasses,
	HtmlString,
	Page,
	PlainText,
	Property,
	Block,
	Row,
	MultiSelectProperty,
	FilesProperty,
	TitleProperty,
	RichTextProperty,
	CheckboxProperty,
	UrlProperty,
	RichTextChunk,
	NotionSort,
} from '$types'
import { env } from '$env/dynamic/private'
import { Client } from '@notionhq/client'
import hljs from 'highlight.js'
import * as S3 from '$db/S3'

const notion = new Client({ auth: env.NOTION_API_KEY })

export default notion

export const filters = {
	published: () => ({ property: 'published', checkbox: { equals: true } }),
	propertyContains: (property: string, contains: string) => ({ property, rich_text: { contains } }),
}

export const sorts: {
	[key: string]: (property: string) => NotionSort
} = {
	ascending: (property: string) => ({ property, direction: 'ascending' }),
}

export async function getDbWithPage<T extends Row>(
	queryObject: QueryDatabaseParameters
): Promise<Page<T>[]> {
	return await Promise.all((await getDb<T>(queryObject)).map(getPage))
}

export async function getDb<T extends Row>(queryObject: QueryDatabaseParameters): Promise<T[]> {
	return (await notion.databases.query(queryObject)).results.map(parseProperties)
}

export async function getPage<T extends Row>(row: T): Promise<Page<T>> {
	return {
		...row,
		page: await pageHtml(row),
	}
}

function parseProperties(row: Row) {
	return { id: row.id, ...objectMap(row.properties, parseProperty) }
}

function parseProperty(property: Property) {
	if (property.type in propertyTypes) {
		return propertyTypes[property.type](property)
	}

	return property
}

const propertyTypes = {
	title: (p: TitleProperty) => p.title[0].plain_text,
	rich_text: (p: RichTextProperty) => parseRichText(p.rich_text),
	checkbox: (p: CheckboxProperty) => p.checkbox,
	url: (p: UrlProperty) => p.url,
	multi_select: (p: MultiSelectProperty) => p.multi_select.map((f) => f.name),
	files: (p: FilesProperty) => {
		const url = p.files[0]?.file.url

		if (url) {
			const urlSlug = S3.extractFromUrl(url)
			return `/notion-asset/${urlSlug}`
		}
	},
	number: (p: { number: number }) => p.number,
}

async function pageHtml(notionDbRow: Row): Promise<HtmlString> {
	const { results: blocks } = await notion.blocks.children.list({
		block_id: notionDbRow.id,
	})

	return blocks
		.map((block) => {
			const type = block.type
			const value = block[type]

			return type in blockTypes ? blockTypes[type](value) : blockTypes.fallback(block)
		})
		.join('')
}

// TODO: video embeds
const blockTypes: Record<string, (block: Block) => HtmlString> = {
	heading_1: ({ rich_text }) => `<h1>${parseRichText(rich_text)}</h1>`,
	heading_2: ({ rich_text }) => `<h2>${parseRichText(rich_text)}</h2>`,
	heading_3: ({ rich_text }) => `<h3>${parseRichText(rich_text)}</h3>`,
	paragraph: ({ rich_text }) => `<p>${parseRichText(rich_text)}</p>`,
	numbered_list_item: ({ rich_text }) => `<li>${parseRichText(rich_text)}</li>`,
	bulleted_list_item: ({ rich_text }) => `<li>${parseRichText(rich_text)}</li>`,
	divider: () => '<hr />',
	image: ({ file, caption }) => {
		const urlSlug = S3.extractFromUrl(file.url)
		return `
			<figure class="image">
				<img src="/notion-asset/${urlSlug}" alt="${parsePlainText(caption)}" />
				<figcaption>${parseRichText(caption)}</figcaption>
			</figure>
		`
		// <img src="${file.url}" alt="${parsePlainText(caption)}" />
	},
	to_do: ({ rich_text, checked }) => {
		return `
			<p>
				<input type="checkbox" ${checked ? 'checked' : ''} onclick="return false;" />
				${parseRichText(rich_text)}
			</p>
		`
	},
	callout: ({ icon, rich_text }) => {
		return `
			<figure class="callout">
				<div>${icon.emoji}</div>
				<div>${parseRichText(rich_text)}</div>
			</figure>
		`
	},
	// Warning: language: Plain text breaks this?!
	code: ({ rich_text, language, caption }) => {
		return `
			<figure class="codeblock">
				<pre>${hljs.highlight(parsePlainText(rich_text), { language }).value}</pre>
			</figure>
			<figcaption>${parseRichText(caption)}</figcaption>
		`
	},
	video: ({ external, caption }) => {
		return `
			<figure>
				<iframe 
				 	class="mx-auto max-w-full"
					width="420" 
					height="315" 
					src="https://www.youtube.com/embed/${getVideoId(external.url)}" 
				/>
			</figure>
			<figcaption>${parseRichText(caption)}</figcaption>
		`
	},
	// embed: ({ url, caption }) => {
	// 	return `
	// 		<figure class="mx-auto">
	// 			<iframe src="${url}" />
	// 			<figcaption>${parseRichText(caption)}</figcaption>
	// 		</figure>
	// 	`
	// },
	// table: (table) => {
	// 	return
	// },
	fallback: (block) => {
		if (env.NODE_ENV === 'production') return ''

		return `
			<p>[TODO: Implement ${block.type} blocks]</p>
			<figure class="codeblock">
				<pre>${hljs.highlight(JSON.stringify(block, undefined, 2), { language: 'json' }).value}</pre>
			</figure>
			<figcaption>Debug Info</figcaption>
		`
	},
}

// TODO: Find elegant way to implement intrapage links
// So far, the best way is a wonky a tag right in the notion text:
// <a href=routename>Link text here! 🤷‍♂️</a>
function parseRichText(rich_text: RichTextChunk[]): HtmlString {
	const chunks = rich_text?.map(wrapChunk).join('')
	return `<span>${chunks || '&nbsp;'}</span>` // &nbsp; to make empty paragraphs take up space
}

function wrapChunk(chunk: RichTextChunk) {
	if (chunk.type === 'mention') return wrapLink(chunk.plain_text, chunk.plain_text, classes(chunk))
	else if (chunk.href) return wrapLink(chunk.href, chunk.text.content, classes(chunk))
	else return `<span class="${classes(chunk)}">${chunk.text.content}</span>`
}

function wrapLink(href: string, content: string, classes: string) {
	return `<a href="${href}" class="${classes}" target=_blank>${content}</a>`
}

function parsePlainText(rich_text: RichTextChunk[]): PlainText {
	return rich_text.map((chunk) => chunk.plain_text).join('')
}

// This assumes tailwind, but it would be pretty easy
// to use the same classnames on the frontend
// TODO: make this tailwind agnostic
function classes(chunk: RichTextChunk): CSSClasses {
	const annotations = chunk.annotations
	return [
		annotations.bold ? 'font-bold' : '',
		annotations.italic ? 'italic' : '',
		annotations.underline ? 'underline' : '',
		annotations.strikethrough ? 'line-through' : '',
		annotations.code ? 'code' : '',
		annotations.color !== 'default' ? `text-${annotations.color}-500` : '',
	]
		.join(' ')
		.trim()
}

function objectMap<T extends Record<string, unknown>>(
	obj: T,
	fn: (value: T[keyof T], key: keyof T, index: number) => unknown
) {
	const entries = Object.entries(obj)

	const mappedEntries = entries.map(([key, value], index) => [key, fn(value, key, index)])

	return Object.fromEntries(mappedEntries)
}

const getVideoId = (url: string) => {
	const urlParts = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
	return urlParts[2] !== undefined ? urlParts[2].split(/[^0-9a-z_-]/i)[0] : urlParts[0]
}
