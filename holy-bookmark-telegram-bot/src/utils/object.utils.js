export function fillObject(instance, data, undefinedValue = null) {
    Object.getOwnPropertyNames(instance).forEach(prop => {
        const value = data[prop];
        if (value === undefined) {
            instance[prop] = undefinedValue;
        } else {
            instance[prop] = value;
        }
    });
}