class CSSHelpers {
	static #head = document.getElementsByTagName('HEAD')[0];

	static addCSS(file) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = file;
		CSSHelpers.#head.appendChild(link);
		return link;
	}

	static removeCSS(link) {
		CSSHelpers.#head.removeChild(link);
	}
}

export default CSSHelpers;
