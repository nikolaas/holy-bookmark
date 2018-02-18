import { Router } from 'express';
import { Permissions } from '../models/permissions';
import { allowSomePermissions } from '../middleware/allow-some-permissions';
import { authenticated } from '../middleware/authenticated';
import { getCurrentUser } from './getCurrentUser';
import { getUsers } from './getUsers';
import { getUser } from './getUser';

export default ({ config, db }) => {
    let api = Router();

    api.get('/user', authenticated(), getCurrentUser);
    api.get('/users', authenticated(), allowSomePermissions(Permissions.SHOW_USER), getUsers);
    api.get('/users/:id', authenticated(), allowSomePermissions(Permissions.SHOW_USER), getUser);

    return api;
}
