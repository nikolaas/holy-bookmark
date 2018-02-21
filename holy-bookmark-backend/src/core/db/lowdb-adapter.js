import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { isPromise } from '../../utils/lang.utils';

class Transaction {

    constructor(lowdb) {
        this.lowdb = lowdb;
        this.closed = false;
    }

    create(storeName) {
        return this.execute(db => {
            const store = db.get(storeName).value();
            return store ? Promise.resolve() : db.set(storeName, []).write();
        });
    }

    get(target, query) {
        return this.execute(db => db.get(target).filter(query).value());
    }

    getOne(target, query) {
        return this.execute(db => db.get(target).find(query).value());
    }

    insert(target, objects) {
        return this.execute(db => {
            const store = db.get(target);
            // invoke value() for every object in order to commit one to store
            objects.map(object => store.push(object).value());
            return store.write();
        });
    }

    insertOne(target, object) {
        return this.execute(db => db.get(target).push(object).write());
    }

    update(target, query, object) {
        return this.execute(db => db.get(target).filter(query).merge(object).write());
    }

    delete(target, query) {
        return this.execute(db => db.get(target).remove(query).write());
    }

    commit() {
        this.checkForClosed();
        return Promise.resolve();
    }

    rollback() {
        this.checkForClosed();
        return Promise.resolve();
    }

    checkForClosed() {
        if (this.closed) {
            throw new Error('Transaction is closed');
        }
    }

    execute(query) {
        this.checkForClosed();
        return this.lowdb.then(query);
    }
}

class Adapter {

    constructor(lowdb) {
        this.lowdb = lowdb;
    }

    transaction(query) {
        const transaction = new Transaction(this.lowdb);
        try {
            let result = query(transaction);
            if (isPromise(result)) {
                return result
                    .then(res => {
                        transaction.commit();
                        return res;
                    })
                    .catch(error => {
                        transaction.rollback();
                        return Promise.reject(error);
                    });
            } else {
                transaction.commit();
                return Promise.resolve(result);
            }
        } catch (error) {
            transaction.rollback();
            return Promise.reject(error);
        }
    }
}

export default function lowdbAdapter(config) {
    const dbUrl = config.get('database.url');
    const dbOptions = { defaultValue: {} };
    return new Adapter(low(new FileAsync(dbUrl, dbOptions)));
}