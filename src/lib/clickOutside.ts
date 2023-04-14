export default function clickOutside(node: HTMLElement, onClickOutside: () => void) {
	const handleClick = (event: PointerEvent) => {
		const isOutside = !node.contains(event.target as Node)

		if (isOutside) onClickOutside()
	}

	document.addEventListener('pointerdown', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('pointerdown', handleClick, true)
		},
	}
}
