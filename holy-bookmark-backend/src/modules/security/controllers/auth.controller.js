import passport from 'passport';
import config from "../../../config";
import { authService } from '../services/auth.service';
import { createJwtToken } from "../core/jwt";

const loginHandler = (req, res, next) => err => {
    if (err) {
        next(err);
    } else {
        const redirectTo = req.session.redirectTo;
        if (redirectTo) {
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        } else {
            res.sendStatus(200);
        }
    }
};

export default class AuthController {

    login(req, res, next) {
        console.log('Incoming authentication request:', req.body);
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                console.error('User authentication failed:', err);
                next(err);
                return;
            }
            if (!user) {
                console.error('User authentication failed: user not founded:', info.message);
                if (config.get('security.unauthorizedRequest.allowRedirect')) {
                    req.session.redirectTo = req.originalUrl;
                    res.redirect(config.get('security.unauthorizedRequest.redirect'));
                    return;
                }

                res.sendStatus(401);
                return;
            }

            createJwtToken(res, user);

            console.log('User authenticated as', user);
            req.logIn(user, { session: false }, loginHandler(req, res, next));
        })(req, res, next);
    };

    logout(req, res) {
        req.logout();
        res.redirect('/');
    };

    register(req, res, next) {
        authService.registerUser(req.body)
            .then(user => {
                req.logIn(user, loginHandler(req, res, next));
            })
            .catch(err => {
                next(err);
            });
    };

}
