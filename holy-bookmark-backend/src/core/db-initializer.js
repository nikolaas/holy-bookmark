function initDb() {
	return Promise.resolve();
}

export function initializeDb (callback) {
	// connect to a database if needed, then pass it to `callback`:
	initDb().then(callback)
}

class DB {

}

export const db = new DB();
