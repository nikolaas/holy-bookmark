import config from 'nconf';
import { path } from 'ramda';
import defaults from './defaults';

config.argv()
    .env()
    .defaults(defaults);

function get(name) {
    const namePath = name.split('.');
    const root = config.get(namePath[0]);
    if (namePath.length === 0) {
        return root;
    }
    return path(namePath.slice(1), root);
}

export default { get };
