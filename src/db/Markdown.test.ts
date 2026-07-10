import { describe, it, expect } from 'vitest'
import * as Markdown from './Markdown'

describe('Markdown.toHtml', () => {
	it('renders basic markdown', async () => {
		const html = await Markdown.toHtml('# Hello\n\nSome **bold** text.')

		expect(html).toContain('<h1>Hello</h1>')
		expect(html).toContain('<strong>bold</strong>')
	})

	it('renders Obsidian image embeds as attachment urls', async () => {
		const html = await Markdown.toHtml('![[santoka.png]]')

		expect(html).toContain('src="/attachments/santoka.png"')
	})

	it('renders Obsidian video embeds', async () => {
		const html = await Markdown.toHtml('![[ronome.mp4]]')

		expect(html).toContain('<video')
		expect(html).toContain('/attachments/ronome.mp4')
	})

	it('renders wikilinks as internal links', async () => {
		const html = await Markdown.toHtml('[[ronome|The Ronome]]')

		expect(html).toContain('href="/ronome"')
		expect(html).toContain('The Ronome')
	})

	it('renders Obsidian callouts', async () => {
		const html = await Markdown.toHtml('> [!note] Heads up\n> Callout body')

		expect(html).toContain('data-callout')
		expect(html).toContain('Heads up')
		expect(html).toContain('Callout body')
	})

	it('renders gfm strikethrough and task lists', async () => {
		const html = await Markdown.toHtml('~~gone~~\n\n- [x] done thing')

		expect(html).toContain('<del>gone</del>')
		expect(html).toContain('checkbox')
	})

	it('highlights code blocks', async () => {
		const html = await Markdown.toHtml('```js\nconst x = 1\n```')

		expect(html).toContain('hljs')
	})

	it('renders inline html without a wrapping paragraph', async () => {
		const html = await Markdown.toInlineHtml(
			'Founding member of http://hyperbloom.ai/ and **more**'
		)

		expect(html).not.toContain('<p>')
		expect(html).toContain('<a href="http://hyperbloom.ai/">')
		expect(html).toContain('<strong>more</strong>')
	})

	it('leaves multi-paragraph inline input wrapped', async () => {
		const html = await Markdown.toInlineHtml('one\n\ntwo')

		expect(html).toContain('<p>one</p>')
		expect(html).toContain('<p>two</p>')
	})

	it('strips script tags', async () => {
		const html = await Markdown.toHtml('hello <script>alert(1)</script>')

		expect(html).not.toContain('<script>')
	})
})
