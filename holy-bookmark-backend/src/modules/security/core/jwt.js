import jwt from "jsonwebtoken";
import config from "../../../config";
import { ExtractJwt } from "passport-jwt";

export function createJwtToken(res, user) {
    const payload = {
        sub: user.id,
        iss: config.get('security.jwt.issuer'),
    };

    const token = jwt.sign(payload, config.get('security.jwt.secret'));

    res.set('Authorization', `Bearer ${token}`);
}

export function configureJwtStrategy() {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.get('security.jwt.secret');
    opts.issuer = config.get('security.jwt.issuer');
    return opts;
}