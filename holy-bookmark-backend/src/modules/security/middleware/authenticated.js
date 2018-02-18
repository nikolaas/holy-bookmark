import config from "../../../config";
import { activationWrapper } from "../helpers";

function authenticatedMiddleware(req, res, next) {
    if (!req.isAuthenticated()) {
        const unauthorizedRequestRedirectPath = config.get('security.unauthorizedRequest.redirect');
        if (unauthorizedRequestRedirectPath) {
            req.session.redirectTo = req.originalUrl;
            res.redirect(unauthorizedRequestRedirectPath);
            return;
        }

        res.sendStatus(401);
        return;
    }

    next();
}

export const authenticated = activationWrapper(() => authenticatedMiddleware);
