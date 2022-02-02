import { browser } from '$app/env'
import { Noise } from 'noisejs'

type Angle = number // in Degrees
type XComponent = number
type YComponent = number
type Coordinate = { x: number; y: number }
type Components = { x: XComponent; y: YComponent }
type Vector = { direction: Angle; magnitude: number }

interface SvelteAction {
	update: (newOptions) => void
	destroy: () => void
}

interface FloatOptions {
	pool?: HTMLElement
}

function wrap (num: number, min: number, max: number): number {
	return num >= min ? num % max : ((num % max) + max) % max
}

function clamp (num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max)
}

function randomIntBetween (min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min)
}

function randomBetween (min: number, max: number) {
	return Math.random() * (max - min) + min
}

function round (num: number, digits: number): number {
	const factor = Math.pow(10, digits)
	return Math.round(num * factor + Number.EPSILON) / factor
}

function sinDegrees (degrees: Angle): YComponent {
	return Math.sin((degrees * Math.PI) / 180)
}

function cosDegrees (degrees: Angle): XComponent {
	return Math.cos((degrees * Math.PI) / 180)
}

function addVectorToCoordinate (coordinate: Coordinate, vector: Vector): Coordinate {
	return {
		x: coordinate.x + vector.magnitude * cosDegrees(vector.direction),
		y: coordinate.y + vector.magnitude * sinDegrees(vector.direction)
	}
}

function vectorComponents (vector: Vector): Components {
	return {
		x: vector.magnitude * cosDegrees(vector.direction),
		y: vector.magnitude * sinDegrees(vector.direction)
	}
}

function componentsToVector (components: Components): Vector {
	return {
		direction: wrap(Math.atan(components.y / components.x) * (180 / Math.PI), 0, 360),
		magnitude: Math.sqrt((components.x ^ 2) + (components.y ^ 2))
	}
}

// This is spuper wrong looool
function addVectors (a: Vector, b: Vector): Vector {
	const aComponents = vectorComponents(a)
	const bComponents = vectorComponents(b)

	return componentsToVector({
		x: aComponents.x + bComponents.x,
		y: aComponents.y + bComponents.y
	})
}

function pointerPosition (e, relativeNode) {
	const rect = relativeNode.getBoundingClientRect()
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	}
}

const noise = new Noise(Math.E)
let z = Math.random()

function flow () {
	z = Math.random()
	console.log('flow changed')

	// setTimeout(flow, Math.floor(Math.random() * 1000))
	if (browser) setTimeout(() => requestAnimationFrame(flow), randomIntBetween(5000, 10000))
}
flow()

export default function float (
	particle: HTMLElement,
	options?: FloatOptions | undefined
): SvelteAction {
	let pool = options?.pool || (particle.parentNode as HTMLElement)

	let position: Coordinate = randomCoordinate()
	let momentum: Vector = { direction: 0, magnitude: 0 } // Degrees and pixels
	let handle: Coordinate = { x: 0, y: 0 }
	let zOffset = randomBetween(-0.1, 0.1)
	let dragging = false
	let cooldown = 0

	function randomX (): number {
		return randomIntBetween(0, pool.getBoundingClientRect().width)
	}

	function randomY (): number {
		return randomIntBetween(0, pool.getBoundingClientRect().height)
	}

	function randomCoordinate (): Coordinate {
		return clampToContainer({ x: randomX(), y: randomY() })
	}

	function clampToContainer (coordinate: Coordinate): Coordinate {
		const poolRect = pool.getBoundingClientRect()
		const particleRect = particle.getBoundingClientRect()

		return {
			x: clamp(coordinate.x, 0, poolRect.width - particleRect.width),
			y: clamp(coordinate.y, 0, poolRect.height - particleRect.width)
		}
	}

	function flowDirection (coordinate: Coordinate): Angle {
		const noiseValue = noise.perlin3(coordinate.x / 1000, coordinate.y / 1000, z + zOffset)
		return clamp(noiseValue * 360 + 180, 0, 360)
	}

	function drift () {
		if (momentum.magnitude <= 0) push()

		momentum.direction = flowDirection(position)
		// Idea from Thomas: Scale the influence of the perlin flow on direction to 1/magnitude
		// momentum = addVectors(momentum, {
		// 	direction: flowDirection(position),
		// 	magnitude: 1 * (1 / momentum.magnitude)
		// })

		updatePosition(addVectorToCoordinate(position, momentum))

		applyFriction()
	}
	function applyFriction (amount = 0.005) {
		momentum.magnitude -= amount
	}

	function push () {
		if (cooldown > 0) return cooldown--

		momentum.magnitude = Math.random() + 0.5
		setCooldown()
	}

	function setCooldown () {
		cooldown = Math.round(Math.random() * 100)
	}

	function dragStart (e) {
		dragging = true
		handle = pointerPosition(e, particle)
		setTimeout(() => particle.setPointerCapture(e.pointerId), 100)
	}

	function dragEnd (e) {
		dragging = false
		particle.releasePointerCapture(e.pointerId)
		// momentum.magnitude = 0
		setCooldown()
	}

	let lastPosition: Coordinate
	let lastTime = new Date().getTime()

	function updatePosition (newPosition) {
		position = clampToContainer(newPosition)
		lastPosition = position
		particle.style.left = position.x + 'px'
		particle.style.top = position.y + 'px'
	}

	function updateMomentum (oldPosition, newPosition) {
		const deltaX = newPosition.x - oldPosition.x
		const deltaY = newPosition.y - oldPosition.y

		const now = new Date().getTime()
		const deltaT = (now - lastTime) / 10 // Arbitrarily scaled by 10? 🤷‍♂️
		lastTime = now

		momentum = {
			direction: Math.atan(deltaY / deltaX) * (180 / Math.PI),
			magnitude: Math.sqrt((deltaX ^ 2) + (deltaY ^ 2)) / deltaT
		}
	}

	function drag (e) {
		if (!dragging) return
		const newPosition = pointerPosition(e, pool)

		// updateMomentum(lastPosition, newPosition) // Makes them throwable kiiiiiiinda!
		updatePosition({
			x: newPosition.x - handle.x,
			y: newPosition.y - handle.y
		})
	}

	pool.style.position = 'relative'
	particle.style.position = 'absolute'
	particle.style.display = 'block'
	particle.addEventListener('pointerdown', dragStart)
	particle.addEventListener('pointerup', dragEnd)
	particle.addEventListener('pointermove', drag)

	function run () {
		if (!dragging) drift()
		setTimeout(() => requestAnimationFrame(run), 10)
	}

	run()

	return {
		update (newOptions) {
			pool = newOptions.pool || pool
		},
		destroy () {
			particle.removeEventListener('pointerdown', dragStart)
			particle.removeEventListener('pointerup', dragEnd)
			particle.removeEventListener('pointermove', drag)
		}
	}
}
