import type { Coordinate, Vector } from '$ukiyo/Numbers'
import type FlowField from '$ukiyo/FlowField'
import * as Numbers from '$ukiyo/Numbers'
import type Container from '$ukiyo/Container'
import { browser } from '$app/environment'
import { bindMethodsToThis } from '$lib/decorators'

function pointerPosition(event: PointerEvent, relativeNode: HTMLElement): Coordinate {
	const rect = relativeNode.getBoundingClientRect()

	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
	}
}

@bindMethodsToThis
export default class Particle {
	flowField: FlowField
	pool: Container
	particle: HTMLElement
	position: Coordinate
	momentum: Vector = { direction: 0, magnitude: 0 } // Degrees and pixels
	handle: Coordinate = { x: 0, y: 0 }
	zOffset = Numbers.randomBetween(-0.1, 0.1)
	dragging = false
	cooldown = 0
	lastPosition: Coordinate
	lastTime = new Date().getTime()
	destroyed = false

	constructor(flowField: FlowField, pool: Container, particle: HTMLElement) {
		this.flowField = flowField
		this.pool = pool
		this.particle = particle

		const startingPosition = pool.randomChildPosition(particle)
		this.position = startingPosition
		this.lastPosition = startingPosition

		this.setup()
	}

	push() {
		if (this.cooldown > 0) {
			return this.cooldown--
		}

		this.momentum.magnitude = Math.random() + 0.5
		this.setCooldown()
	}

	drift() {
		if (this.momentum.magnitude <= 0) this.push()

		this.momentum.direction = this.flowField.directionAt(this.position, this.zOffset)

		// Idea from Luca: Scale the influence of the perlin flow on direction to 1/magnitude
		// momentum = addVectors(momentum, {
		// 	direction: flowDirection(position),
		// 	magnitude: 1 * (1 / momentum.magnitude)
		// })

		const nextPosition = Numbers.addVectorToCoordinate(this.position, this.momentum)
		this.updatePosition(nextPosition, this.pool)

		this.applyFriction()
	}

	setCooldown() {
		this.cooldown = Math.round(Math.random() * 100)
	}

	applyFriction(amount = 0.005) {
		this.momentum.magnitude -= amount
	}

	dragStart(event: PointerEvent) {
		this.particle.dispatchEvent(new CustomEvent('dragstart'))
		this.dragging = true
		this.handle = pointerPosition(event, this.particle)
		// This timeout controls how fast a click turns into a drag. Longer times make it
		// easier to click but also make shorter drags open the page, which can be frustrating.
		setTimeout(() => this.particle.setPointerCapture(event.pointerId), 50)
	}

	drag(event: PointerEvent) {
		if (!this.dragging) return
		const newPosition = pointerPosition(event, this.pool.container)

		// updateMomentum(lastPosition, newPosition) // Makes them throwable kiiiiiiinda!
		const offsetPosition = {
			x: newPosition.x - this.handle.x,
			y: newPosition.y - this.handle.y,
		}
		this.updatePosition(offsetPosition, this.pool)
	}

	dragEnd(event: PointerEvent) {
		this.dragging = false
		this.particle.releasePointerCapture(event.pointerId)
		// momentum.magnitude = 0
		this.setCooldown()
	}

	updatePosition(newPosition: Coordinate, pool: Container) {
		this.position = pool.clampChildToContainer(this.particle, newPosition)
		this.lastPosition = this.position
		this.particle.style.left = this.position.x + 'px'
		this.particle.style.top = this.position.y + 'px'

		this.particle.dispatchEvent(
			new CustomEvent<Coordinate>('particle-move', { detail: this.position })
		)
	}

	updateMomentum(oldPosition: Coordinate, newPosition: Coordinate) {
		const deltaX = newPosition.x - oldPosition.x
		const deltaY = newPosition.y - oldPosition.y

		const now = new Date().getTime()
		const deltaT = (now - this.lastTime) / 10 // Arbitrarily scaled by 10? 🤷‍♂️
		this.lastTime = now

		this.momentum = {
			direction: Math.atan(deltaY / deltaX) * (180 / Math.PI),
			magnitude: Math.sqrt((deltaX ^ 2) + (deltaY ^ 2)) / deltaT,
		}
	}

	tick() {
		if (this.destroyed) return

		if (!this.dragging) this.drift()
		setTimeout(() => requestAnimationFrame(this.tick), 10)
	}

	setup() {
		if (!browser) return

		this.particle.style.position = 'absolute'
		this.particle.style.display = 'block'
		this.particle.addEventListener('pointerdown', this.dragStart)
		this.particle.addEventListener('pointerup', this.dragEnd)
		this.particle.addEventListener('pointermove', this.drag)

		this.tick()
	}

	update(newPool: Container) {
		this.pool = newPool
	}

	destroy() {
		this.destroyed = true
		this.particle.removeEventListener('pointerdown', this.dragStart)
		this.particle.removeEventListener('pointerup', this.dragEnd)
		this.particle.removeEventListener('pointermove', this.drag)
	}
}
