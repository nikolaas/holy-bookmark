const users = [];

function getUsers() {
    return Promise.resolve([...users]);
}

function findUser(prop, value) {
    const result = users.filter(user => user[prop] === value);
    return result.length === 0 ? null : result[0];
}

function findUserById(id) {
    return Promise.resolve(findUser('id', id));
}

function findUserByName(name) {
    return Promise.resolve(findUser('name', name));
}

function saveUser(user) {
    users.push(user);
    return Promise.resolve(user);
}

export const UserStore = {
    getUsers,
    findUserById,
    findUserByName,
    saveUser,
};
