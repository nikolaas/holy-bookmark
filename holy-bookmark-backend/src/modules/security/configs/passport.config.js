import passport from 'passport';
import { Strategy } from 'passport-local';
import { authService } from '../services/auth.service';

const USER_NOT_FOUND = 'USER_NOT_FOUND';
const INVALID_PASSWORD = 'INVALID_PASSWORD';

function auth(username, password, done) {
    authService.findUserByName(username)
        .then(user => {
            if (user == null) {
                return Promise.reject(USER_NOT_FOUND);
            }
            if (!authService.isPasswordValid(user, password)) {
                return Promise.reject(INVALID_PASSWORD);
            }
            return done(null, user);
        })
        .catch(error => {
            if (error === USER_NOT_FOUND) {
                console.log(`User with name ${username} not founded`);
                return done(null, false, { message: 'Incorrect username.' });
            } else if (error === INVALID_PASSWORD) {
                console.log(`Incorrect password`);
                return done(null, false, { message: 'Incorrect password.' });
            } else {
                console.log(`Authentication failed:`);
                console.log(error);
                return done(error);
            }
        });
}

function serializeUser(user, done) {
    done(null, user.id);
}

function deserializeUser(id, done) {
    authService.findUserById(id)
        .then(user => {
            if (user == null) {
                return Promise.reject(USER_NOT_FOUND);
            }
            done(null,user);
        })
        .catch(function(error) {
            done(error);
        });
}

function createStrategy(strategy, config) {
    switch (strategy) {
        case 'local': {
            const usernameField = config.get('security.strategy.usernameField');
            const passwordField = config.get('security.strategy.passwordField');
            console.log(`Username expected in field "${usernameField}", password expected in field "${passwordField}"`);
            const options = { usernameField, passwordField };
            return new Strategy(options, auth);
        }
        default: {
            throw new Error(`Unknown auth strategy "${strategy}"`);
        }
    }
}

export default function configurePassport(strategy, config) {
    passport.use(createStrategy(strategy, config));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
}
