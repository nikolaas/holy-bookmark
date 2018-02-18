import { UserStore } from '../stores/user.store';
import { createUser, toPublicUser, toPublicUsers } from '../models/user';
import { createError } from '../../../models/error';
import { Errors } from '../models/errors';

function validateNewUserRequest(registerRequest) {
    const {username, password, confirmPassword} = registerRequest;
    if (password !== confirmPassword) {
        return Promise.reject(createError(Errors.PASSWORD_CONFIRMATION_ERROR, 'Password and password confirmation do not match'));
    }
    return UserStore.findUserByName(username)
        .then(user => {
            if (user != null) {
                return Promise.reject(createUser(Errors.USER_EXISTS, `User with name ${username} already exists`));
            }
        });
}

function registerUser(registerRequest) {
    const {username, password} = registerRequest;
    return validateNewUserRequest(registerRequest)
        .then(() => {
            return UserStore.saveUser(createUser(username, password));
        })
        .then(user => {
            //TODO save user data
            return user;
        })
        .then(user => {
            console.log(`Register user with name "${username}" and password "${password}"`);
            return toPublicUser(user);
        })
        .catch(error => {
            console.log(`Register user with name "${username}" failed with error`);
            console.log(error);
            return Promise.reject(error);
        });
}

function isPasswordValid(user, password) {
    return user.password === password;
}

function auth(username, password) {
    return UserStore.findUserByName(username)
        .then(user => {
            if (user == null) {
                return Promise.reject(Errors.USER_NOT_FOUND);
            }
            if (!isPasswordValid(user, password)) {
                return Promise.reject(Errors.INVALID_PASSWORD);
            }
            return toPublicUser(user);
        });
}

function findUserById(id) {
    return UserStore.findUserById(id).then(toPublicUser);
}

function findUserByName(name) {
    return UserStore.findUserByName(name).then(toPublicUser);
}

function getUsers() {
    return UserStore.getUsers().then(toPublicUsers);
}

export const authService = {
    registerUser,
    auth,
    findUserById,
    findUserByName,
    getUsers,
};