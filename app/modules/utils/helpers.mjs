/**
 * ## Description
 * The `rerouteEvent` function is a utility function that allows you to reroute an event from one
 * element to another element. It listens for a specified event on the `elementSource` and when
 * the event occurs, it creates a new custom event with the same event data and dispatches it on
 * the `elementTarget`. This enables you to "reroute" or forward the event from one element to
 * another in your web application.
 * 
 * ## Parameters
 * - `eventSource` (string): The name of the event to listen for on the `elementSource`.
 * - `eventTarget` (string): The name of the custom event that will be dispatched on the `elementTarget`.
 * - `elementSource` (EventTarget): The source element on which the original event will be listened for.
 * - `elementTarget` (EventTarget, optional, default: `document`): The target element on which the custom
 *   event will be dispatched. If not provided, the default target will be the `document`.
 * 
 * ## Return value
 * - `handler` (function): The event handler function that has been attached to the `elementSource`.
 *   You can use this returned handler function to remove the event listener later, if desired.
 * 
 * ## Notes
 * - The `eventSource` and `eventTarget` parameters must be valid event names, e.g., 'click', 'change', etc.
 * - The `elementSource` and `elementTarget` parameters must be valid DOM elements or objects that implement
 *   the EventTarget interface (e.g., HTMLElement, Document, etc.).
 * - Be cautious when rerouting events, as it may lead to unexpected behavior or event loops if not handled
 *   properly.
 * - Always clean up your event listeners when they are no longer needed to prevent memory leaks and unwanted
 *   side effects. You can remove the event listener by calling `removeEventListener` with the same `eventSource`
 *   and `handler` function returned by `rerouteEvent`.
 */
function rerouteEvent(eventSource, eventTarget, elementSource, elementTarget=document) {
	function handler(event) {
		let customEvent = new CustomEvent(eventTarget, {detail: event});
		elementTarget.dispatchEvent(customEvent);
	}
	elementSource.addEventListener(eventSource, handler);
	return handler;
}

export {
	rerouteEvent,
};
