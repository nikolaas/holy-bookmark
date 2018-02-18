import config from "../../../config";
import { activationWrapper, getPermissions, hasSomePermission } from '../helpers';

function allowSomePermissionsMiddlewareFactory(allowedPermissions) {
    return function allowSomePermissionsMiddleware(req, res, next) {
        //TODO load user by req.session.userid if req.user not exists
        if (!req.isAuthenticated()) {
            console.log(`Private route "${req.originalUrl}" is not allowed for not authenticated user`);

            const unauthorizedRequestRedirectPath = config.get('security.unauthorizedRequest.redirect');
            if (unauthorizedRequestRedirectPath) {
                req.session.redirectTo = req.originalUrl;
                res.redirect(unauthorizedRequestRedirectPath);
                return;
            }

            res.sendStatus(401);
            return;
        }

        if (!hasSomePermission(allowedPermissions, getPermissions(req.user))) {
            res.sendStatus(403);
            return;
        }

        next();
    };
}

export const allowSomePermissions = activationWrapper(allowSomePermissionsMiddlewareFactory);
