import { authenticated } from './middleware/authenticated';
import { allowSomePermissions } from './middleware/allow-some-permissions';
import securityModule from './module';

export {
    authenticated,
    allowSomePermissions,
};

export default securityModule;
