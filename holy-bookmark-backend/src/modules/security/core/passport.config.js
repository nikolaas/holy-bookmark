import passport from 'passport';
import { createLocalStrategy } from './local-strategy-factory';
import { createJwtStrategy } from './jwt-strategy-factory';
import { authService } from '../services/auth.service';

function serializeUser(user, done) {
    done(null, user.id);
}

function deserializeUser(id, done) {
    authService.findUserById(id)
        .then(user => {
            if (user == null) {
                return Promise.reject('USER_NOT_FOUND');
            }
            done(null,user);
        })
        .catch(function(error) {
            done(error);
        });
}

export default function configurePassport(config) {
    passport.use(createLocalStrategy());
    passport.use(createJwtStrategy(config));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
}
