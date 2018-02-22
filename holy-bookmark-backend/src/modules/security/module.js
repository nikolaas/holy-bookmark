import session from 'express-session';
import passport from 'passport';
import { module } from '../../core/modules';
import { isActive, activate } from './activation';
import { preInstallUsers } from './pre-install';
import configurePassport from './core/passport.config';
import AuthController from './controllers/auth.controller';
import api from './api';

function configureExpress(app) {
    app.use(session({
        secret: 'i need more beers',
        resave: false,
        saveUninitialized: false,
    }));

    // Passport:
    app.use(passport.initialize());
    app.use(passport.session());
}

function installStores() {
    return preInstallUsers();
}

function installApi(app) {
    app.use('/api', api());
}

function installControllers(app) {
    const authController =  new AuthController();
    app.post('/login', authController.login);
    app.post('/register', authController.register);
    app.get('/logout', authController.logout);
}

function securityModule({app}) {
    if (isActive()) {
        return;
    }
    activate();

    configureExpress(app);
    configurePassport();

    return Promise.resolve()
        .then(() => installStores())
        .then(() => installApi(app))
        .then(() => installControllers(app));
}

export default module('security', securityModule);
