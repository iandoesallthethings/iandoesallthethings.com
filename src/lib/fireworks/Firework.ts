import { random, calculateDistance } from './helpers'

export default class Firework {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
	sx: number
	sy: number
	tx: number
	ty: number
	hue: number
	distanceToTarget: number
	distanceTraveled: number
	coordinates: number[][]
	coordinateCount: number
	angle: number
	speed: number
	acceleration: number
	brightness: number
	targetRadius: number

	constructor(
		ctx: CanvasRenderingContext2D,
		sx: number,
		sy: number,
		tx: number,
		ty: number,
		hue: number
	) {
		this.ctx = ctx
		this.x = sx
		this.y = sy

		// starting coordinates
		this.sx = sx
		this.sy = sy

		// target coordinates
		this.tx = tx
		this.ty = ty
		this.hue = hue

		this.distanceToTarget = calculateDistance(sx, sy, tx, ty)
		this.distanceTraveled = 0

		this.coordinates = []
		this.coordinateCount = 3

		while (this.coordinateCount--) {
			this.coordinates.push([this.x, this.y])
		}
		this.angle = Math.atan2(ty - sy, tx - sx)
		this.speed = 2
		this.acceleration = 1.05
		this.brightness = random(50, 70)
		// circle target indicator radius
		this.targetRadius = 1
	}

	update() {
		// remove last item in coordinates array
		this.coordinates.pop()
		// add current coordinates to the start of the array
		this.coordinates.unshift([this.x, this.y])

		// cycle the circle target indicator radius
		if (this.targetRadius < 8) {
			this.targetRadius += 0.3
		} else {
			this.targetRadius = 1
		}

		// speed up the firework
		this.speed *= this.acceleration

		// get the current velocities based on angle and speed
		const vx = Math.cos(this.angle) * this.speed
		const vy = Math.sin(this.angle) * this.speed

		// how far will the firework have traveled with velocities applied?
		this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy)
		this.x += vx
		this.y += vy
	}

	draw() {
		this.ctx.beginPath()
		// move to the last tracked coordinate in the set, then draw a line to the current x and y
		this.ctx.moveTo(
			this.coordinates[this.coordinates.length - 1][0],
			this.coordinates[this.coordinates.length - 1][1]
		)
		this.ctx.lineTo(this.x, this.y)
		this.ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)'
		this.ctx.stroke()

		this.ctx.beginPath()
		// draw the target for this firework with a pulsing circle
		this.ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2)
		this.ctx.stroke()
	}
}
