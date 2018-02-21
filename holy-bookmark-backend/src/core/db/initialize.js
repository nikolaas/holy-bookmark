import config from "../../config";
import { Database } from "./database";
import { createDatabaseAdapter } from "./adapters";
import { dbManager } from "./database-manager";

export function initializeDb () {
    // connect to a database if needed, then pass it to `callback`:
    return createDatabaseAdapter(config.get('database.type'))
        .then(adapter => {
            return dbManager.initialize(new Database(adapter));
        });
}
