export type Url = string

export type HTML = string
export type PlainText = string
export type CSSClasses = string

export type FieldName = 'education' | 'music' | 'development' | 'all the things'

export interface Field {
	name: FieldName
	blurb?: string
}

export interface Project {
	name: string
	title: string
	subtitle: string
	route: string
	fields: FieldName[]
	link?: Url
	video?: Url
	image?: Url
	published?: boolean
	page?: { [key: string]: unknown }
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
