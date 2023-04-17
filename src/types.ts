export type UrlString = string

export type HtmlString = string
export type PlainText = string
export type CSSClasses = string

export type FieldName = 'education' | 'music' | 'development' | 'all the things'

export type Row = Field | Project

export interface BaseRow {
	id: string
	properties: Record<PropertyName, Property>
}

export interface Field extends BaseRow {
	name: FieldName
	blurb?: string
}

export interface Project extends BaseRow {
	name: string
	subtitle: string
	route: string
	fields: FieldName[]
	link?: UrlString
	video?: UrlString
	image?: UrlString
	published: boolean
}

export type PropertyName = 'title' | 'rich_text' | 'checkbox' | 'url' | 'multi_select' | 'files'

export type Property =
	| TitleProperty
	| RichTextProperty
	| CheckboxProperty
	| UrlProperty
	| MultiSelectProperty
	| FilesProperty

export interface BaseProperty {
	id: string
	type: PropertyName
}

export interface TitleProperty extends BaseProperty {
	title: { plain_text: string }[]
}

export interface RichTextProperty extends BaseProperty {
	rich_text: RichTextChunk[]
}

export interface RichTextChunk {
	type: string
	plain_text: string
	text: { content: string }
	href?: string
	annotations: {
		bold?: boolean
		italic?: boolean
		strikethrough?: boolean
		underline?: boolean
		code?: boolean
		color?: string
	}
}

export interface CheckboxProperty extends BaseProperty {
	checkbox: { checkbox: boolean }
}

export interface UrlProperty extends BaseProperty {
	url: { url: UrlString }
}

export interface MultiSelectProperty extends BaseProperty {
	multi_select: { name: string }[]
}

export interface FilesProperty extends BaseProperty {
	files: { file: { url: UrlString } }[]
}

export type Page<T extends Row> = T & {
	page: HtmlString
}

export type BlockType =
	| 'heading_1'
	| 'heading_2'
	| 'heading_3'
	| 'paragraph'
	| 'numbered_list_item'
	| 'bulleted_list_item'
	| 'divider'
	| 'image'
	| 'to_do'
	| 'callout'
	| 'code'
	| 'video'
	| 'embed'
	| 'table'
	| 'fallback'

export interface Block {
	type: BlockType

	text: RichTextChunk[]
	caption: RichTextChunk[]
	checked: boolean
	file: { url: string }
	icon: { emoji: string }
	language: string
	external: { url: string }
}

export interface Db {
	fields: Field[]
	projects: Project[]
}

export interface ProjectCache {
	[key: string]: Project
}

export interface Props {
	props: JsonObject
}

// Recursive type for value that can be encoded.
export type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject

export type ArbitraryFunction = (...args: unknown[]) => unknown

export interface ArbitraryClass<T> {
	new (...args: unknown[]): T
}

export interface JsonObject {
	[key: string]: JsonValue
}

export interface ActionEventListeners {
	update?: (parameters: any) => void
	destroy?: () => void
}
