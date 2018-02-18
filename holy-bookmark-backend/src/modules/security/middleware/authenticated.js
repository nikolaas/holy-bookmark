import { activationWrapper } from '../helpers';
import { createAuthenticator } from './authenticator';

export const authenticated = activationWrapper(() => createAuthenticator());
