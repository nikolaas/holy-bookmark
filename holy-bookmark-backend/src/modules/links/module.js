import { module } from '../../core/modules';
import api from './api';

function linksModule({ app }) {
    app.use('/api', api());
}

export default module('links', linksModule);
