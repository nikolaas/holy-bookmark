import { Strategy as LocalStrategy } from 'passport-local';
import { authService } from "../services/auth.service";
import { Errors } from "../models/errors";

function auth(username, password, done) {
    authService.auth(username, password)
        .then(user => {
            return done(null, user);
        })
        .catch(error => {
            if (error === Errors.USER_NOT_FOUND) {
                console.log(`User with name ${username} not founded`);
                return done(null, false, { message: 'Incorrect username.' });
            } else if (error === Errors.INVALID_PASSWORD) {
                console.log(`Incorrect password`);
                return done(null, false, { message: 'Incorrect password.' });
            } else {
                console.log('Authentication failed:', error);
                return done(error);
            }
        });
}

export function createLocalStrategy() {
    const usernameField = 'username';
    const passwordField = 'password';
    const session = false;
    const options = { usernameField, passwordField, session };
    return new LocalStrategy(options, auth);
}