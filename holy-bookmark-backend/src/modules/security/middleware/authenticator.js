import passport from "passport";

export function createAuthenticator() {
    return passport.authenticate('jwt', { session: false });
}