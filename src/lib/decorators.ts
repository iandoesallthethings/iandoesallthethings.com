import type { ArbitraryFunction, ArbitraryClass } from '$types'

/*
 * This decorator binds all methods to the class instance.
 * It's equivalent to adding @bindThis to every method on the class.
 *
 * It's an alternative to doing this
 * this.methodName = this.methodName.bind(this)
 * for every method in the constructor.
 */
export function bindMethodsToThis<T>(target: ArbitraryClass<T>): ArbitraryClass<T> {
	const proto = target.prototype

	Object.getOwnPropertyNames(proto).forEach((name) => {
		const descriptor = Object.getOwnPropertyDescriptor(proto, name)

		if (descriptor && typeof descriptor.value === 'function') {
			Object.defineProperty(proto, name, bindThis(proto, name, descriptor))
		}
	})

	return target
}

/*
 * This decorator binds the method to the class instance.
 *
 * class Story {
 *   @bindThis
 *   getNextBeat() { ... }
 * }
 *
 * is equivalent to:
 *
 * class Story {
 *   constructor() {
 * 	   this.getNextBeat = this.getNextBeat.bind(this)
 *   }
 *
 *   getNextBeat() { ... }
 * }
 */
export function bindThis<T extends ArbitraryFunction>(
	target: object,
	propertyKey: string,
	descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
	if (!descriptor || typeof descriptor.value !== 'function') {
		throw new TypeError(
			`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`
		)
	}

	return {
		configurable: true,
		get(this: T): T {
			const bound: T = descriptor.value.bind(this)

			Object.defineProperty(this, propertyKey, {
				value: bound,
				configurable: true,
				writable: true,
			})
			return bound
		},
	}
}
