// @ts-expect-error This is a weird commonjs shim
import noisejs from 'noisejs'
const { Noise } = noisejs
import * as Numbers from '$ukiyo/Numbers'
import type { Coordinate, Angle } from '$ukiyo/Numbers'
import { browser } from '$app/environment'
import { bindMethodsToThis } from '$lib/decorators'

@bindMethodsToThis
export default class FlowField {
	// @ts-expect-error Old library is old
	noise: Noise = new Noise(Math.E)
	z: number = Math.random()
	destroyed = false

	constructor() {
		if (!browser) return
		this.flow()
	}

	flow() {
		if (this.destroyed) return

		this.z = Math.random()
		setTimeout(() => requestAnimationFrame(this.flow), Numbers.randomIntBetween(5000, 10000))
	}

	directionAt(coordinate: Coordinate, zOffset: number): Angle {
		const noiseValue = this.noise.perlin3(
			coordinate.x / 1000,
			coordinate.y / 1000,
			this.z + zOffset
		)

		return Numbers.clamp(noiseValue * 360 + 180, 0, 360)
	}

	destroy() {
		this.destroyed = true
	}
}
