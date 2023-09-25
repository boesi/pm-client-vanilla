import ColorConversion from '/modules/utils/color-conversion.mjs';
import CanvasHelper from '/modules/utils/canvas-helper.mjs';
import StorageData from './data.mjs';
import config from '/config.js';

class ProviderFile {

	/**
	 * How can I use this method? Knowing if this provider is usable on this
	 * system in advance, is clearly an advantage. But where should I call this
	 * method?
	 */
	supported() {
		return window.showOpenFilePicker === 'function';
	}

	#supportedFileTypes = [{
		description: "PNG",
		accept: {
			"image/png": [".png"],
		}
	}, {
		description: "Pixel Mover Json",
		accept: {
			"application/json": [".pmj"],
		}
	}]

	async save(data) {
		let success = false;
		try {
			const handle = await window.showSaveFilePicker({types: this.#supportedFileTypes});
			const stream = await handle.createWritable();
			const ext = handle.name.substring(handle.name.lastIndexOf('.'));
			let dataToWrite = null;
			switch (ext) {
				case '.pmj':
					dataToWrite = JSON.stringify(data);
					break;
				case '.png':
					dataToWrite = await this.saveImage(data, ext);
					break;
				default:
					throw new Error(`The file type ${ext} is unsupported`);
			}
			await stream.write(dataToWrite);
			await stream.close();
			success = true;
		} catch (error) {
			if (error.name !== 'AbortError') throw error;
		}
		return success;
	}

	async saveImage(data, ext) {
		let canvas = new CanvasHelper(data.pixels.length, data.pixels[0].length, {offscreen: true});
		canvas.setPixelData(data.pixels);
		let type = `image/${ext};`;
		let blob = await canvas.convertToBlob({type});
		return blob;
	}

	async loadImage(file) {
		let image = await window.createImageBitmap(file.slice(0, file.size, file.type));
		let canvas = new CanvasHelper(image.width, image.height, {offscreen: true});
		canvas.context.drawImage(image, 0, 0);
		return canvas.getPixelData();
	}

	async load(name) {
		try {
			const [handle] = await window.showOpenFilePicker({types: this.#supportedFileTypes});
			const file = await handle.getFile();
			if (file.type.startsWith('image')) {
				let data = new StorageData();
				data.pixels = await this.loadImage(file);
				return data;
			} else {
				return JSON.parse(await file.text());
			}
		} catch (error) {
			if (error.name !== 'AbortError') throw error;
		}
		return null;
	}

	remove(name) {
		throw new Error('The storage provider File does not support removing items. Just remove the files yourself.');
	}
}

export default ProviderFile;
