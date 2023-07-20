class CSSHelpers {
	static #head = document.getElementsByTagName('HEAD')[0];

	static getCSS(file) {
		let links = document.getElementsByTagName('link');
		for (let link of links) {
			if (link.href.substr(-file.length) == file) return link;
		}
		return null;
	}

	static addCSS(file) {
		let link = this.getCSS(file);
		if (! link) {
			link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = file;
			CSSHelpers.#head.appendChild(link);
		}
		return link;
	}

	static removeCSS(link) {
		CSSHelpers.#head.removeChild(link);
	}
}

export default CSSHelpers;
