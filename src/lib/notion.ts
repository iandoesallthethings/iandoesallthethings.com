import { Client } from '@notionhq/client'
import hljs from 'highlight.js'
import type { CSSClasses, HTML, PlainText } from '$lib/types'

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export default notion

export async function getDb(queryObject) {
	return (await notion.databases.query(queryObject)).results.map(parseProperties)
}

export async function getDbWithPages(queryObject) {
	return (await getDb(queryObject)).map(getPage)
}

export async function getPage(row) {
	return { ...row, page: parsePage(await notion.blocks.children.list({ block_id: row.id })) }
}

function parseProperties(row) {
	return { id: row.id, ...objectMap(row.properties, parseProperty) }
}

function parseProperty(property) {
	if (property.type in propertyTypes) return propertyTypes[property.type](property)
	else return property
}

const propertyTypes = {
	title: (p) => p.title[0].plain_text,
	rich_text: (p) => parseRichText(p.rich_text),
	files: (p) => p.files[0]?.file.url,
	checkbox: (p) => p.checkbox,
	url: (p) => p.url,
	multi_select: (p) => p.multi_select.map((f) => f.name)
}

function parsePage(page): HTML {
	return page?.results
		.map((block) => {
			const type = block.type

			if (block.type in blockTypes) return blockTypes[type](block[type])
			else return blockTypes.fallback(block)
		})
		.join('')
}

// TODO: video embeds
const blockTypes = {
	heading_1: (heading) => `<h1>${parseRichText(heading.text)}</h1>`,
	heading_2: (heading) => `<h2>${parseRichText(heading.text)}</h2>`,
	heading_3: (heading) => `<h3>${parseRichText(heading.text)}</h3>`,
	paragraph: (paragraph) => `<p>${parseRichText(paragraph.text)}</p>`,
	numbered_list_item: (list_item) => `<li>${parseRichText(list_item.text)}</li>`,
	bulleted_list_item: (list_item) => `<li>${parseRichText(list_item.text)}</li>`,
	divider: () => '<hr />',
	image: (image) => {
		return `
			<figure class="image">
				<img src="${image.file.url}" alt="${parsePlainText(image.caption)}" />
				<figcaption>${parseRichText(image.caption)}</figcaption>
			</figure>
		`
	},
	to_do: (to_do) => {
		return `
			<p>
				<input type="checkbox" ${to_do.checked ? 'checked' : ''} onclick="return false;" />
				${parseRichText(to_do.text)}
			</p>
		`
	},
	callout: (callout) => {
		return `
			<figure class="callout">
				<div>${callout.icon.emoji}</div>
				<div>${parseRichText(callout.text)}</div>
			</figure>
		`
	},
	// Warning: language: Plain text breaks this?!
	code: (code) => {
		return `
			<figure class="codeblock">
				<pre>${hljs.highlight(parsePlainText(code.text), { language: code.language }).value}</pre>
			</figure>
			<figcaption>${parseRichText(code.caption)}</figcaption>
		`
	},
	video: (video) => {
		return `
			<figure>
				<iframe 
					width="420" 
					height="315" 
					src="https://www.youtube.com/embed/${getVideoId(video.external.url)}" 
				/>
			</figure>
			<figcaption>${parseRichText(video.caption)}</figcaption>
		`
	},
	// embed: (embed) => {
	// 	TODO
	// 	return `
	// 		<figure>
	// 			<iframe src="${embed.url}" />
	// 		</figure>
	// 		<figcaption>${parseRichText(embed.caption)}</figcaption>
	// 	`
	// },
	// table: (table) => {
	// 	TODO
	// 	return
	// },
	fallback: (block) => {
		const env = process.env.NODE_ENV

		if (env === 'development') return JSON.stringify(block)
		else return `<p>[TODO: Implement ${block.type} blocks]</p>`
	}
}

// TODO: Find elegant way to implement intrapage links
// So far, the best way is a wonky a tag right in the notion text:
// <a href=routename>Link text here! 🤷‍♂️</a>
function parseRichText(rich_text): HTML {
	const chunks = rich_text.map(wrapChunk).join('')
	return `<span>${chunks || '&nbsp;'}</span>` // &nbsp; to make empty paragraphs take up space
}

function wrapChunk(chunk) {
	if (chunk.type === 'mention') return wrapLink(chunk.plain_text, chunk.plain_text, classes(chunk))
	else if (chunk.href) return wrapLink(chunk.href, chunk.text.content, classes(chunk))
	else return `<span class="${classes(chunk)}">${chunk.text.content}</span>`
}

function wrapLink(href, content, classes) {
	return `<a href="${href}" class="${classes}" target=_blank>${content}</a>`
}

function parsePlainText(rich_text): PlainText {
	return rich_text.map((chunk) => chunk.plain_text).join('')
}

// This assumes tailwind, but it would be pretty easy
// to use the same classnames on the frontend
// TODO: make this tailwind agnostic
function classes(chunk): CSSClasses {
	const annotations = chunk.annotations
	return [
		annotations.bold ? 'font-bold' : '',
		annotations.italic ? 'italic' : '',
		annotations.underline ? 'underline' : '',
		annotations.strikethrough ? 'line-through' : '',
		annotations.code ? 'code' : '',
		annotations.color !== 'default' ? `text-${annotations.color}-500` : ''
	]
		.join(' ')
		.trim()
}

const objectMap = (obj, fn) =>
	Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

const getVideoId = (url) => {
	url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
	return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]
}
