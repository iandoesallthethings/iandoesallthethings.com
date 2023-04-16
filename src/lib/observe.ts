/* Whenever you see this function, it indicates that we're just using this
 * variable to trigger reactive behavior from Svelte.
 *
 * For example:
 *
 * let currentTime = new Date()
 *
 * window.setInterval(() => {
 *   currentTime = new Date()
 * }, 1000)
 *
 * $: {
 *   // We don't actually need the value from currentTime, we just want it in
 *   // our reactive block so it re-runs every second.
 *   observe(currentTime)
 *   console.log("Tick.")
 * }
 */
export default function observe<Observed>(observed: Observed): Observed {
	return observed
}
