class StorageData {
	name = 'Pixel Mover Data';
	pixels = null;
	walkers = null;
	
	toJson() {
		return {
			name: this.name,
			pixels: this.pixels,
			walkers: this.walkers,
		}
	}
}

export default StorageData;
