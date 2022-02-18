export default function floatToTop (element) {
	element.style.zIndex =
		Math.max(
			...Array.from(document.querySelectorAll('body *'), el =>
				parseFloat(window.getComputedStyle(el).zIndex)
			).filter(zIndex => !Number.isNaN(zIndex)),
			0
		) + 1
}
