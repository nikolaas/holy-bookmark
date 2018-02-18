import passport from 'passport';
import { authService } from '../services/auth.service';
import config from "../../../config";

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

    constructor(strategy) {
        this.strategy = strategy;

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
    }

    // Здесь мы проверяем, передаем данные о пользователе в функцию верификации, котоую мы определили выше.
    // Вообще, passport.authenticate() вызывает метод req.logIn автоматически, здесь же я указал это явно.
    // Это добавляет удобство в отладке. Например, можно вставить сюда console.log(), чтобы посмотреть, что происходит...
    // При удачной авторизации данные пользователя будут храниться в req.user
    login(req, res, next) {
        console.error('Incoming authentication request:', req.body);
        passport.authenticate(this.strategy,
            function(err, user, info) {
                if (err) {
                    console.error('User authentication failed:', err);
                    next(err);
                    return;
                }
                if (!user) {
                    console.error('User authentication failed: user not founded:', info.message);
                    const unauthorizedRequestRedirectPath = config.get('security.unauthorizedRequest.redirect');
                    if (unauthorizedRequestRedirectPath) {
                        req.session.redirectTo = req.originalUrl;
                        res.redirect(unauthorizedRequestRedirectPath);
                        return;
                    }

                    res.sendStatus(401);
                    return;
                }

                console.log('User authenticated as', user);
                req.logIn(user, loginHandler(req, res, next));
            }
        )(req, res, next);
    };

    // Здесь все просто =)
    logout(req, res) {
        req.logout();
        res.redirect('/');
    };

    // Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
    register(req, res, next) {
        console.log(`Register user request received`);
        authService.registerUser(req.body)
            .then(user => {
                req.logIn(user, loginHandler(req, res, next));
            })
            .catch(err => {
                next(err);
            });
    };

}
