class DatabaseManager {

    constructor() {
        this.dbInstance = null;
        this.stores = [];
    }

    registerStore(store) {
        if (this.stores.indexOf(store) >= 0) {
            throw new Error(`Database store "${store}" already exists`);
        }
        this.stores.push(store);
    }

    initialize(dbInstance) {
        this.dbInstance = dbInstance;
        return this.dbInstance.transaction(tx => {
            return Promise.all(this.stores.map(store => tx.create(store)));
        })
    }

    transaction(query) {
        if (!this.dbInstance) {
            throw new Error('Database is not initialized');
        }
        return this.dbInstance.transaction(query);
    }
}

export const dbManager = new DatabaseManager();
