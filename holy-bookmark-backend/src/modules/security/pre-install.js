import config from "../../config";
import { createUser } from "./models/user";
import { userDao } from "./dao/user.dao";

function getPreInstalledUsers() {
    let preInstalledUsers = null;

    const preInstalledUsersFile = config.get('security.preInstalledUsersFile');
    if (preInstalledUsersFile) {
        console.log(`Pre install users from ${preInstalledUsersFile}`);
        preInstalledUsers = require(preInstalledUsersFile);
    }

    if (!preInstalledUsers) {
        const preInstalledUsersSource = config.get('security.preInstalledUsers');
        if (preInstalledUsersSource) {
            console.log('Pre install users from inline source');
            preInstalledUsers = JSON.parse(preInstalledUsersSource);
        }
    }

    return preInstalledUsers || [];
}

function installUser(user) {
    return userDao.saveUser(createUser(
        user.username,
        user.password,
        user.permissions,
        user.roles,
    ));
}

/**
 * Allow to install users when application deploy with clear database. Installing users configure
 * by one of config properties (properties listed in order rising priority)
 *
 * 1) security.preInstalledUsers - json string contains array of users
 * 2) security.preInstalledUsersFile - path to json file contains array of users
 *
 * @returns {Promise<T>}
 */
export function preInstallUsers() {
    return userDao.getUsers()
        .then(users => {
            if (!users || users.length === 0) {
                try {
                    return Promise.all(getPreInstalledUsers().map(installUser));
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        })
        .catch(error => {
            console.error(`Pre installing users failed with error`, error);
            return Promise.reject(error);
        });
}
