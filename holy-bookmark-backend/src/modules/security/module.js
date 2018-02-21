import session from 'express-session';
import passport from 'passport';
import { module } from '../../core';
import { isActive, activate } from './activation';
import { createUser } from './models/user';
import { Permissions } from './models/permissions';
import { userDao } from './dao/user.dao';
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

function createUserIfNotExist(user) {
    return userDao.findUserByName(user.name).then(existedUser => {
        if (!existedUser) {
            return userDao.saveUser(user);
        }
    })
}

function installStores() {
    return Promise.all([
        createUserIfNotExist(createUser('admin', 'admin', [Permissions.SHOW_USER])),
        createUserIfNotExist(createUser('user1', '1')),
        createUserIfNotExist(createUser('user2', '2')),
    ]);
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
