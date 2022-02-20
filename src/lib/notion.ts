import dotenv from 'dotenv'
import { Client } from '@notionhq/client'

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_API_KEY })

export default notion

export async function getDb(queryObject) {
	return (await notion.databases.query(queryObject)).results.map(getProperties)
}

export async function getDbWithPages(queryObject) {
	return (await getDb(queryObject)).map(getPage)
}

function getProperties (row) {
	return { id: row.id, ...objectMap(row.properties, parseProperty) }
}

async function getPage (row) {
	return { ...row, page: parsePage(await notion.blocks.children.list({ block_id: row.id })) }
}

function parseProperty (property) {
	if (property.type in propertyTypes) return propertyTypes[property.type](property)
	else return property
}

const propertyTypes = {
	title: p => p.title[0].plain_text,
	rich_text: p => parseRichText(p.rich_text),
	files: p => p.files[0]?.file.url,
	checkbox: p => p.checkbox,
	url: p => p.url,
	multi_select: p => p.multi_select.map(f => f.name)

}

function parsePage (page): string {
	return page?.results.map(block => {
			const type = block.type

			if (block.type in blockTypes) return blockTypes[type](block[type])
			else return `<p>[Unsupported Block type: ${type}]</p>`
			// else return JSON.stringify(block)
		}).join('')
}

// TODO: video embeds
const blockTypes = {
	heading_1: heading => `<h1>${parseRichText(heading.text)}</h1>`,
	heading_2: heading => `<h2>${parseRichText(heading.text)}</h2>`,
	heading_3: heading => `<h3>${parseRichText(heading.text)}</h3>`,
	paragraph: paragraph => `<p>${parseRichText(paragraph.text) || '&nbsp'}</p>`,
	numbered_list_item: list_item => `<li>${parseRichText(list_item.text)}</li>`,
	bulleted_list_item: list_item => `<li>${parseRichText(list_item.text)}</li>`,
	divider: () => '<hr />',
	image: image => {
		return `
			<figure>
				<img src="${image.file.url}" alt="${plainText(image.caption)}" />
				<figcaption>${parseRichText(image.caption)}</figcaption>
			</figure>
		`
	},
	to_do: to_do => {
		return `
			<p>
				<input type="checkbox" ${to_do.checked ? 'checked' : ''} onclick="return false;" />
				${parseRichText(to_do.text)}
			</p>
		`
	},
	callout: callout => {
		return `
			<figure class="callout">
				<div>${callout.icon.emoji}</div>
				<div>${parseRichText(callout.text)}</div>
			</figure>
		`
	},
	code: code => {
		return `
			<figure class="codeblock ${code.language}">
				<pre>${parseRichText(code.text)}</pre>
			</figure>
			<figcaption>${parseRichText(code.caption)}</figcaption>
		`
	}
}

function parseRichText (rich_text): string {
	const chunks = rich_text.map(chunk => {
		const text = chunk.text.content

		if (chunk.href) return `<a href="${chunk.href}" class="${getClasses(chunk)}">${text}</a>`
		else return `<span class="${getClasses(chunk)}">${text}</span>`
	})
	return `<span>${chunks.join('')}</span>`
}

function plainText(rich_text) {
	return rich_text.map(chunk=> chunk.plain_text).join('') 
}

// This assumes tailwind, but it would be pretty easy 
// to use the same classnames on the frontend 
// TODO: make this tailwind agnostic
function getClasses (chunk): string {
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

const objectMap = (obj, fn) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

