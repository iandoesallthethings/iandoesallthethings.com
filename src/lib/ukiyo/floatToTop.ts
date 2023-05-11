export default function floatToTop(element: HTMLElement, selector = 'body *') {
	const allElementsInMain = document.querySelectorAll(selector)

	const zIndexes = Array.from(allElementsInMain, getZIndex).filter(isNotNaN)

	const highestZIndex = Math.max(...zIndexes, 0) + 1

	element.style.zIndex = highestZIndex.toString()
}

function getZIndex(element: Element) {
	return parseFloat(window.getComputedStyle(element).zIndex)
}

function isNotNaN(value: number): boolean {
	return !Number.isNaN(value)
}
