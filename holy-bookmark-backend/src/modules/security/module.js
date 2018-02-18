import session from 'express-session';
import passport from 'passport';
import { module } from '../../core/module';
import { isActive, activate } from './activation';
import { createUser } from './models/user';
import { Permissions } from './models/permissions';
import { UserStore } from './stores/user.store';
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

function installStores(config, db) {
    return Promise.all([
        UserStore.saveUser(createUser('admin', 'admin', [Permissions.SHOW_USER])),
        UserStore.saveUser(createUser('user1', '1')),
        UserStore.saveUser(createUser('user2', '2')),
    ]);
}

function installApi(app, config, db) {
    app.use('/api', api({ config, db }));
}

function installControllers(app, config) {
    const authController =  new AuthController(config);
    app.post('/login', authController.login);
    app.post('/register', authController.register);
    app.get('/logout', authController.logout);
}

function securityModule({app, config, db}) {
    if (isActive()) {
        return;
    }
    activate();

    configureExpress(app);
    configurePassport(config);

    return Promise.resolve()
        .then(() => installStores(config, db))
        .then(() => installApi(app, config, db))
        .then(() => installControllers(app, config));
}

export default module('security', securityModule);
