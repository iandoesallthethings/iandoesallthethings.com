export function random(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export function calculateDistance(p1x: number, p1y: number, p2x: number, p2y: number) {
	const xDistance = p1x - p2x
	const yDistance = p1y - p2y
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}
