import type { ActionEventListeners } from '$types'

// This action lets you "teleport" an element to a different part of the HTML tree.
//
// This is useful for things like modals, where for styling reasons you want it to
// be near the root of the document.
//
// Here's an example. Let's say you have a modal. For code clarity, you want to render
// it from inside a deeply nested div. But for styling reasons, you want it to actually
// appear inside a modal container you've defined close to the root of the document.
//
// You can do that like so:
//
// <div id="modal-container" />
//
// <div class='deeply-nested'>
//   <div class='modal' use:portal={'#modal-container'}>
//     Now you're thinking with portals.
//   </div>
// </div>
//
// If you ran this code in the browser, you'd see your modal div inside of #modal-container,
// *not* inside of .deeply-nested.
//
// When we teleport the elements, we wrap them in a div with the class "portal-container". This
// make it easy to remove teleported elements when Svelte destroys them.
//
// We copied this implementation from here:
// https://svelte.dev/repl/86ec36c27be2471f86590e0c18c7198c?version=3.23.2

export default function portal(
	fromElement: HTMLElement, // We're going to teleport this element's children.
	selector: string // Where we're going to teleport the children to.
): ActionEventListeners {
	// Find where the portal should go.
	const toElement = document.querySelector(selector)
	if (toElement == null) {
		const message =
			'Ran into a problem trying to use portals to render an element outside its normal place in the DOM. ' +
			`I was told to render the element into ${selector}, but I can't find an element that matches that selector. ` +
			"A couple things to check: First, make sure there's not a typo in the selector. You should also make sure " +
			`you're rendering an element that matches ${selector} somewhere. You can probably find the component that's ` +
			`triggering this error by doing a global search for use:portal={'${selector}'}. See portals.ts for more info ` +
			'on what portals do and why you might want to use them.'
		throw new Error(message)
	}

	// Create the container where we're going to put fromElement's children.
	const portalContainer = document.createElement('div')
	portalContainer.className = 'portal-container'

	// Add fromElement's children to the portal container.
	// const fromElementChildren = Array.from(fromElement.children)
	portalContainer.append(fromElement)

	// Add portal container to the DOM.
	toElement.append(portalContainer)

	return {
		destroy() {
			portalContainer.remove()
		},
	}
}
