import config from 'nconf';
import defaults from './defaults';
import env from './env';

const LOGICAL_SEPARATOR = '.';

// 1. from parsed env and env
config.overrides({ logicalSeparator: LOGICAL_SEPARATOR, store: env }).env();

// 2. from external config
const externalConfigPath = config.get('EXTERNAL_CONFIG');
if (externalConfigPath) {
    try {
        config.file({ logicalSeparator: LOGICAL_SEPARATOR, file: externalConfigPath });
        console.log(`External config loaded at ${externalConfigPath}`);
    } catch (error) {
        console.log(`External config loading at path ${externalConfigPath} failed`, error);
    }
}

// 3. from default config
config.defaults({ logicalSeparator: LOGICAL_SEPARATOR, store: defaults });

export default config;
