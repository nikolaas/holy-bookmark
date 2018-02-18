import { Router } from 'express';
import { version } from '../../package.json';
import { registerMethods } from '../utils/api.utils';
import bookmarksMethods from './bookmarks';

export default ({ config, db }) => {
	const api = Router();

	registerMethods(api, ...bookmarksMethods);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
