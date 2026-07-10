export type UrlString = string
export type HtmlString = string

export type FieldName = string

export type Row = Field | Project

export interface Field {
	id: string
	name: FieldName
	blurb?: string
	order: number
	published: boolean
}

export interface Project {
	id: string
	name: string
	subtitle: string
	route: string
	fields: FieldName[]
	link?: UrlString
	video?: UrlString
	image?: UrlString
	published: boolean
	indev: boolean
}

export type Page<T extends Row> = T & {
	page: HtmlString
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArbitraryFunction = (...args: any[]) => unknown

export interface ArbitraryClass<T> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...args: any[]): T
}
