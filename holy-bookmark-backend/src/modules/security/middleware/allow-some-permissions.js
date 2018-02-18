import config from "../../../config";
import { activationWrapper, getPermissions, hasSomePermission } from '../helpers';
import { createAuthenticator } from "./authenticator";

function allowSomePermissionsMiddlewareFactory(allowedPermissions) {
    const authenticator = createAuthenticator();
    return function allowSomePermissionsMiddleware(req, res, next) {
        authenticator(req, res, err => {
            if (err) {
                next(err);
                return;
            }
            if (!req.isAuthenticated()) {
                if (config.get('security.unauthorizedRequest.allowRedirect')) {
                    req.session.redirectTo = req.originalUrl;
                    res.redirect(config.get('security.unauthorizedRequest.redirect'));
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
        });
    };
}

export const allowSomePermissions = activationWrapper(allowSomePermissionsMiddlewareFactory);
