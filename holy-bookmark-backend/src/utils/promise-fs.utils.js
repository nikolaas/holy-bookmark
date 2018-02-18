import fs from 'fs';

export function rename(from, to) {
    return new Promise((resolve, reject) => {
        fs.rename(from, to, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function stat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, function (err, stat) {
            if (err) {
                reject(err);
            } else {
                resolve(stat);
            }
        });
    });
}

export function unlink(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
