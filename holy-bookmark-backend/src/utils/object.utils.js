export function instantiate(Constructor, data, undefinedValue = null) {
    const obj = new Constructor();

    Object.getOwnPropertyNames(obj).forEach(prop => {
        const value = data[prop];
        if (value === undefined) {
            obj[prop] = undefinedValue;
        } else {
            obj[prop] = value;
        }
    });

    return obj;
}