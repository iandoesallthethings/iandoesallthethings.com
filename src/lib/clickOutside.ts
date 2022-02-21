export default function clickOutside(node) {
	const handleClick = (event) => {
		if (!node.contains(event.target)) node.dispatchEvent(new CustomEvent('outclick'))
	}

	document.addEventListener('pointerdown', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('pointerdown', handleClick, true)
		}
	}
}
