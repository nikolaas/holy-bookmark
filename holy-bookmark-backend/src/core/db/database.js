export class Database {

	constructor(adapter) {
		this.adapter = adapter;
	}

	transaction(...args) {
		return this.adapter.transaction(...args);
	}

}
