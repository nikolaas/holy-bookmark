import config from 'nconf';
import defaults from './defaults';

const CONFIG_OPTIONS = {
    logicalSeparator: '.'
};

config.argv()
    .env()
    .defaults({ ...CONFIG_OPTIONS, ...defaults });

const externalConfigPath = config.get('EXTERNAL_CONFIG');
if (externalConfigPath) {
    try {
        config.file({ ...CONFIG_OPTIONS, file: externalConfigPath });
        console.log(`External config loaded at ${externalConfigPath}`);
    } catch (error) {
        console.log(`External config loading at path ${externalConfigPath} failed`, error);
    }
}

export default config;
