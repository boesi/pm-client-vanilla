export default class ColorConversion {
	static #regexColors = /[^\d]*(\d{1,3})[^\d]*(\d{1,3})[^\d]*(\d{1,3}).*/;

	static numberToString(type, red, green, blue) {
		switch (type) {
			case 'rgb':
				return `rgb(${red}, ${green}, ${blue})`;
			case '#':
				return `#${red < 16 ? '0' : ''}${red.toString(16)}${green < 16 ? '0' : ''}${green.toString(16)}${blue < 16 ? '0' : ''}${blue.toString(16)}`;
			default:
				console.error(`${type} is not a valid type for conversion. Only rgb or # are supported.`);
				break;
		}
	}

	static stringToString(type, strColor) {
		// if strColor is not null or undefined, we try to parse it otherwise we just return the original value
		if (strColor) {
			switch (true) {
				case strColor.startsWith(type):
					return strColor;
				case strColor.startsWith('rgb') || strColor.startsWith('#'):
					return ColorConversion.numberToString('#', ...ColorConversion.stringToNumber(type === '#' ? 'rgb' : '#', strColor));
				default:
					console.error(`Do not know how to convert ${strColor} to hex.`);
					break;
			}
		}
		return strColor;
	}

	static stringToNumber(type, strColor) {
		let red = null, green = null, blue = null;
		switch (type) {
			case 'rgb':
				let result = this.#regexColors.exec(strColor);
				if (result) {
					let [strColor2, strRed, strGreen, strBlue] = result;
					if (strRed != undefined) red = Number.parseInt(strRed, 10);
					if (strGreen != undefined) green = Number.parseInt(strGreen, 10);
					if (strBlue != undefined) blue = Number.parseInt(strBlue, 10);
				}
				break;
			case '#':
				let offset = strColor.startsWith('#') ? 1 : 0;
				let lenColor = -1;
				switch (strColor.length) {
					case 3 + offset:
						lenColor = 1;
						break;
					case 6 + offset:
					case 8 + offset:
						lenColor = 2;
						break;
					default:
						console.error(`${strColor} does not seem to be a valid color string`);
						break;
				}
				if (lenColor > 0) {
					let index = offset;
					let strRed = strColor.substring(index, index + lenColor);
					index += lenColor;
					let strGreen = strColor.substring(index, index + lenColor);
					index += lenColor;
					let strBlue = strColor.substring(index, index + lenColor);
					if (strRed != undefined) red = Number.parseInt(strRed, 16);
					if (strGreen != undefined) green = Number.parseInt(strGreen, 16);
					if (strBlue != undefined) blue = Number.parseInt(strBlue, 16);
				}
				break;
			default:
				console.error(`${type} is not a valid type for conversion. Only rgb or # are supported.`);
				break;
		}
		return [red, green, blue];
	}
}
