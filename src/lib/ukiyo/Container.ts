import { bindMethodsToThis } from '$lib/decorators'
import * as Numbers from '$ukiyo/Numbers'
import type { Coordinate } from '$ukiyo/Numbers'

@bindMethodsToThis
export default class Container {
	container: HTMLElement

	constructor(container: HTMLElement) {
		container.style.position = 'relative'
		this.container = container
	}

	rect(): DOMRect {
		return this.container.getBoundingClientRect()
	}

	randomX(): number {
		return Numbers.randomIntBetween(0, this.container.getBoundingClientRect().width)
	}

	randomY(): number {
		return Numbers.randomIntBetween(0, this.container.getBoundingClientRect().height)
	}

	randomChildPosition(childElement: HTMLElement): Coordinate {
		return this.clampChildToContainer(childElement, {
			x: this.randomX(),
			y: this.randomY(),
		})
	}

	clampChildToContainer(childElement: HTMLElement, coordinate: Coordinate): Coordinate {
		const poolRect = this.rect()
		const particleRect = childElement.getBoundingClientRect()

		return {
			x: Numbers.clamp(coordinate.x, 0, poolRect.width - particleRect.width),
			y: Numbers.clamp(coordinate.y, 0, poolRect.height - particleRect.height),
		}
	}
}
