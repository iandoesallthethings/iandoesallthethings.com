// import { Noise } from 'noisejs'
// import { onMount } from 'svelte'

// let noise
// onMount(() => (noise = new Noise(Math.random())))

export function wrap (num: number, min: number, max: number): number {
	return num >= min ? num % max : ((num % max) + max) % max
}

export function clamp (num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max)
}

export function randomIntBetween (min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min)
}

export function round (num: number, digits: number): number {
	const factor = Math.pow(10, digits)
	return Math.round(num * factor + Number.EPSILON) / factor
}

export function sinDegrees (degrees: Angle): YComponent {
	return Math.sin((degrees * Math.PI) / 180)
}

export function cosDegrees (degrees: Angle): XComponent {
	return Math.cos((degrees * Math.PI) / 180)
}

export function randomX (container: HTMLElement): number {
	if (container) return randomIntBetween(0, container.getBoundingClientRect().width)
}

export function randomY (container: HTMLElement): number {
	if (container) return randomIntBetween(0, container.getBoundingClientRect().height)
}

export function randomZ (container: HTMLElement): number {
	if (container) return Math.random()
}

export function randomCoordinate (container: HTMLElement): Coordinate {
	if (!container) return { x: 200, y: 200, z: 0 }

	return clampToContainer(container, {
		x: randomX(container),
		y: randomY(container),
		z: randomZ(container)
	})
}

export function clampToContainer (container: HTMLElement, coordinate: Coordinate): Coordinate {
	if (!container) return coordinate

	return {
		x: clamp(coordinate.x, 0, container.getBoundingClientRect().width),
		y: clamp(coordinate.y, 0, container.getBoundingClientRect().height),
		z: coordinate.z
	}
}

export function addVectorToCoordinate (coordinate: Coordinate, vector: Vector): Coordinate {
	return {
		x: coordinate.x + vector.magnitude * cosDegrees(vector.direction),
		y: coordinate.y + vector.magnitude * sinDegrees(vector.direction),
		z: coordinate.z
	}
}

export function coordinateToDirection (coordinate: Coordinate, noise): Angle {
	const noiseValue = noise.perlin3(coordinate.x / 1000, coordinate.y / 1000, coordinate.z)

	return clamp(noiseValue * 360 + 180, 0, 360)
}

export default function float (node) {
	return {
		destroy () {
			// Remove event listeners here
		}
	}
}
