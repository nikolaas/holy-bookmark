import { activationWrapper } from '../helpers';

function authenticatedRedirectMiddlewareFactory(path) {
     function authenticatedRedirectMiddleware(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect(path);
        } else {
            next();
        }
    }
    authenticatedRedirectMiddleware.middlewareName = `redirect to "${path}"`;
    return authenticatedRedirectMiddleware;
}

export const authenticatedRedirect = activationWrapper(authenticatedRedirectMiddlewareFactory);
