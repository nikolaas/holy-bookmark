export function isFunction(object) {
    const getType = {};
    return object && getType.toString.call(object) === '[object Function]';
}

export function isArray(object) {
    return object instanceof Array;
}

export function isString(object) {
    return typeof object === 'string' || (object instanceof String);
}

export function isPromise(object) {
    if (!object) {
        return false;
    }
    return isFunction(object.then);
}

export function isObject(target) {
    return typeof target === 'object';
}
