import ColorConversion from '/modules/utils/color-conversion.mjs';
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

	async save(data) {
		const handle = await window.showSaveFilePicker();
		const stream = await handle.createWritable();
		const ext = handle.name.substring(handle.name.lastIndexOf('.'));
		console.log('===> storage/provider-file.save', {ext, handle, stream});
		let dataToWrite = null;
		switch (ext) {
			case '.pmj':
				dataToWrite = JSON.stringify(data);
				break;
			default:
				throw new Error(`The file type ${ext} is unsupported`);
		}
		await stream.write(dataToWrite);
		await stream.close();
	}

	getPixelData(context, size) {
		let data = Array(size.width);
		for (let x=0; x<data.length; x++) data[x] = Array(size.height);

		let imgData = context.getImageData(0, 0, size.width, size.height).data;
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let coord = this.getRedIndexForCoord(x, y, size.width);
				let [red, green, blue, alpha] = imgData.slice(coord, coord+4);
				if (alpha !== 0) {
					// although white is just a regular color, we assume that here is no pixel, so the other boards do not overload
					// and for the canvas board "no pixel" means the same as "white pixel"
					if (red !== 255 && green !== 255 && blue !== 255) {
						data[x][y] = ColorConversion.numberToString(config.colorType, red, green, blue);
					}
				}
			}
		}
		return data;
	}

	getRedIndexForCoord(x, y, width) {
		return y * (width * 4) + x * 4;
	}

	async loadImage(file) {
		let image = await window.createImageBitmap(file.slice(0, file.size, file.type));
		let canvas = new  OffscreenCanvas(image.width, image.height);
		let context = canvas.getContext('2d');
		context.drawImage(image, 0, 0);
		return this.getPixelData(context, {width: image.width, height: image.height});
	}

	async load(name) {
		try {
			const [handle] = await window.showOpenFilePicker();
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
