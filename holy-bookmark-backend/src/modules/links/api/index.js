import { Router } from 'express';
import { registerMethods } from '../../../utils/api.utils';
import register from './register';
import getAll from './getAll';
import getCount from './getCount';
import del from './delete';

export default () => {
    const api = Router();

    registerMethods(api, register, getAll, getCount, del);

    // perhaps expose some API metadata at the root
    // api.get('/', (req, res) => {
    //     res.json({ version });
    // });

    return api;
}
