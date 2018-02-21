import { AbstractStore } from "../../../core/db";

class UserDao extends AbstractStore {

    constructor() {
        super('users');
    }

    getUsers() {
        return this.get();
    }

    findUserById(id) {
        return this.getById(id);
    }

    findUserByName(name) {
        return this.getOne({ name });
    }

    saveUser(user) {
        return this.execute(tx => {
            return tx.getOne(this.storeName, { name: user.name })
                .then(existedUser => {
                    if (existedUser) {
                        return tx.update(this.storeName, { name: user.name }, user);
                    } else {
                        return tx.insertOne(this.storeName, user);
                    }
                });
        });
    }

}

export const userDao = new UserDao();
