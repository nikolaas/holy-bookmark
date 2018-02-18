import {authService} from "../services/auth.service";

export function getUsers(req, res, next) {
    authService.getUsers()
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            next(error);
        });
}
