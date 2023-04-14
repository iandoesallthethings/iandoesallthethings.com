export type Angle = number // in Degrees
export type XComponent = number
export type YComponent = number
export type Coordinate = { x: number; y: number }
export type Components = { x: XComponent; y: YComponent }
export type Vector = { direction: Angle; magnitude: number }

export function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max)
}

export function randomIntBetween(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min)
}

export function randomBetween(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export function sinDegrees(degrees: Angle): YComponent {
	return Math.sin((degrees * Math.PI) / 180)
}

export function cosDegrees(degrees: Angle): XComponent {
	return Math.cos((degrees * Math.PI) / 180)
}

export function addVectorToCoordinate(coordinate: Coordinate, vector: Vector): Coordinate {
	return {
		x: coordinate.x + vector.magnitude * cosDegrees(vector.direction),
		y: coordinate.y + vector.magnitude * sinDegrees(vector.direction),
	}
}

// This is spuper wrong looool
export function addVectors(a: Vector, b: Vector): Vector {
	const aComponents = vectorComponents(a)
	const bComponents = vectorComponents(b)

	return componentsToVector({
		x: aComponents.x + bComponents.x,
		y: aComponents.y + bComponents.y,
	})
}

export function wrap(num: number, min: number, max: number): number {
	return num >= min ? num % max : ((num % max) + max) % max
}

export function round(num: number, digits: number): number {
	const factor = Math.pow(10, digits)
	return Math.round(num * factor + Number.EPSILON) / factor
}

export function vectorComponents(vector: Vector): Components {
	return {
		x: vector.magnitude * cosDegrees(vector.direction),
		y: vector.magnitude * sinDegrees(vector.direction),
	}
}

export function componentsToVector(components: Components): Vector {
	return {
		direction: wrap(Math.atan(components.y / components.x) * (180 / Math.PI), 0, 360),
		magnitude: Math.sqrt((components.x ^ 2) + (components.y ^ 2)),
	}
}
