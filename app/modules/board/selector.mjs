import BoardSVG from '/modules/board/svg.mjs';
import BoardHTML from '/modules/board/html.mjs';
import BoardCanvas from '/modules/board/canvas.mjs';

class Selector {
	#boardData = null;
	#onBoardClick = null;
	#wndSelect = document.createRange().createContextualFragment(`
		<label id="board-type">
			Board:
			<select>
				<option value="---">---</option>
				<option value="canvas">Canvas</option>
				<option value="html">HTML</option>
				<option value="svg">SVG</option>
			</select>
		</label>
	`);

	constructor(boardData, onBoardClick) {
		this.#boardData = boardData;
		this.#onBoardClick = onBoardClick;
		this.#wndSelect.querySelector('#board-type select').addEventListener('input', this.select.bind(this));
	}

	get content() {
		return this.#wndSelect;
	}

	select(event) {
		switch (event.srcElement.value) {
			case 'canvas':
				this.#boardData.setBoard(new BoardCanvas(this.#onBoardClick));
				break;
			case 'html':
				this.#boardData.setBoard(new BoardHTML(this.#onBoardClick));
				break;
			case 'svg':
				this.#boardData.setBoard(new BoardSVG(this.#onBoardClick));
				break;
			default:
				break;
		}
	}
}

export default Selector;
