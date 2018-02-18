import { isActive } from "./activation";

export function activationWrapper(middlewareFactory) {
    return (...args) => {
        if (!isActive()) {
            return (req, res, next) => {
                console.log('Security module was not be activated. Authenticated access to route is disabled.');
                next();
            }
        }
        return middlewareFactory(...args);
    };
}

export function getPermissions(user) {
    return user.permissions;
}

function hasPermission(requestedPermissions, existingPermission) {
    return requestedPermissions.length === 0 || requestedPermissions.indexOf(existingPermission) >= 0;
}

export function hasSomePermission(requestedPermissions, existingPermissions) {
    if (requestedPermissions == null || requestedPermissions.length === 0) {
        return true;
    }
    return existingPermissions.filter(existingPermission => hasPermission(requestedPermissions, existingPermission)).length > 0;
}
