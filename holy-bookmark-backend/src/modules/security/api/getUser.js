import {authService} from "../services/auth.service";

function findUser(id) {
    if (/^\d+$/.test(id)) {
        return authService.findUserById(parseInt(id, 10));
    } else {
        return authService.findUserByName(id);
    }
}

export function getUser(req, res, next) {
    findUser(req.params.id)
        .then(users => {
            res.json(users);
        })
        .catch(error => {
            next(error);
        });
}
