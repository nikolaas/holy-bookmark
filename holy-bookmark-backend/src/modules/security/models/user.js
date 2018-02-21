import {omit} from "ramda";

const PRIVATE_PROPS = ['password'];

export class User {

    constructor(id, name, password, permissions, roles) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.permissions = permissions;
        this.roles = roles;
    }
    
}

/**
 * Create user with specified login and password
 * @param name {string}
 * @param password {string}
 * @param permissions {Array<string>}
 * @param roles {Array<string>}
 * @returns {User}
 */
export function createUser(name, password, permissions = [], roles = []) {
    return new User(null, name, password, permissions, roles);
}

export function toPublicUser(user) {
    if (user) {
        return omit(PRIVATE_PROPS, user);
    }
    return null;
}

export function toPublicUsers(users) {
    return users.map(toPublicUser);
}
