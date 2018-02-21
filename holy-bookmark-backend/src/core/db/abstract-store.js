import uuid from "uuid/v4";
import { isArray, isString } from "../../utils/lang.utils";
import { dbManager } from "./database-manager";

export class AbstractStore {

    static generateId(object) {

        return object;
    }

    constructor(params) {
        if (isString(params)) {
            this.storeName = params;
            this.idField = 'id';
            this.autoGenerateId = true;
        } else {
            this.storeName = params.storeName;
            this.idField = params.idField || 'id';
            this.autoGenerateId = params.autoGenerateId != null ? params.autoGenerateId : true;
        }
        if (!this.storeName) {
            throw new Error('Store name is missing.');
        }
        dbManager.registerStore(this.storeName);
    }

    get(query) {
        return dbManager.transaction(tx => tx.get(this.storeName, query));
    }

    getOne(query) {
        return dbManager.transaction(tx => tx.getOne(this.storeName, query));
    }

    getById(id) {
        return dbManager.transaction(tx => tx.getOne(this.storeName, { [this.idField]: id }));
    }

    preCreate(object) {
        if (this.autoGenerateId && object[this.idField] == null) {
            object[this.idField] = uuid();
        }
        return object;
    }

    create(objects) {
        const arr = isArray(objects) ? objects : [objects];
        return dbManager.transaction(tx => tx.insert(this.storeName, arr.map(item => this.preCreate(item))));
    }

    update(query, object) {
        return dbManager.transaction(tx => tx.update(this.storeName, query, object));
    }

    delete(query) {
        return dbManager.transaction(tx => tx.delete(this.storeName, query));
    }

    execute(query) {
        return dbManager.transaction(tx => query(tx));
    }
}
