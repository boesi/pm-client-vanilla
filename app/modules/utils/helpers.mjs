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
