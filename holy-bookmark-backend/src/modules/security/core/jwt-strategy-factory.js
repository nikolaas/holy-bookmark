import { Strategy as JwtStrategy } from 'passport-jwt';
import { authService } from '../services/auth.service';
import { configureJwtStrategy } from './jwt';

export function createJwtStrategy() {
    const opts = configureJwtStrategy();
    return new JwtStrategy(opts, function(jwtPayload, done) {
        authService.findUserById(jwtPayload.sub)
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            })
            .catch(error => {
                return done(error, false);
            });
    });
}
