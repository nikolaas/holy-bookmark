import { Router } from 'express';
import { version } from '../../package.json';
import { registerMethods } from '../utils/api.utils';
import linksMethods from './links';

export default () => {
	const api = Router();

	registerMethods(api, ...linksMethods);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
