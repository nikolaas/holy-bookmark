import config from "../../config";
import lowdbAdapter from "./lowdb-adapter";

const adapters = {
    'lowdb': lowdbAdapter,
};

export function createDatabaseAdapter(dbType) {
    const adapter = adapters[dbType];
    if (!adapter) {
        return Promise.reject(new Error(`Unknown database type "${dbType}"`));
    }
    return Promise.resolve(adapter(config));
}
