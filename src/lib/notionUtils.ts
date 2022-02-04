export function getClasses (chunk): string {
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

export function parseRichText (richText): string {
	const chunks = richText.map(chunk => {
		const text = chunk.text.content

		if (chunk.href) return `<a href="${chunk.href}" class="${getClasses(chunk)}">${text}</a>`
		else return `<span class="${getClasses(chunk)}">${text}</span>`
	})
	return `<span>${chunks.join('')}</span>`
}

export function parseHeading (block): string {
	const headingType = block.type.at(-1)

	const text = block[`heading_${headingType}`].text
	return `<h${headingType}>${parseRichText(text)}</h${headingType}>`
}

export function parseParagraph (block): string {
	const text = block.paragraph.text

	return `<p>${parseRichText(text) || '&nbsp'}</p>`
}

export function parsePage (page): string {
	if (!page.results) return ''

	const blocks = page?.results.map(block => {
		if (block.type === 'paragraph') return parseParagraph(block)
		else if (block.type.startsWith('heading')) return parseHeading(block)
		// images
		// code blocks
		// video embeds??
		// Lists (ordered and unordered)
		// Todo list (checkboxes)
	})

	return `<span>${blocks.join('')}</span>`
}
