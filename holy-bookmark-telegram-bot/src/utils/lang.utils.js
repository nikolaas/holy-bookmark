export function isFunction(target) {
    const getType = {};
    return target && getType.toString.call(target) === '[object Function]';
}

export function isArray(target) {
    return target instanceof Array;
}

export function isString(target) {
    return typeof target === 'string' || (target instanceof String);
}

export function isPromise(target) {
    if (!target) {
        return false;
    }
    return isFunction(target.then);
}

export function isObject(target) {
    return typeof target === 'object';
}