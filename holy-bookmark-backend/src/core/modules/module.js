export function module(name, handler) {
    let active = false;
    return {
        name,
        handler: (...args) => {
            if (active) {
                return;
            }
            active = true;
            return handler(...args);
        }
    };
}