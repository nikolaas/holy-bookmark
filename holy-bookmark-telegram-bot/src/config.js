import config from 'nconf';
import { isObject } from './utils/lang.utils'

config.argv().env();

const externalConfigPath = config.get('EXTERNAL_CONFIG');
if (externalConfigPath) {
    try {
        const externalConfig = require(externalConfigPath).default;
        config.defaults(externalConfig);
        console.log(`External config loaded at ${externalConfigPath}`);
    } catch (error) {
        console.log(`External config loading at path ${externalConfigPath} failed`, error);
    }
}

function createConfigProxyHandler(isNConf = false) {
    const properties = {};

    return {
        get(target, name) {
            if (name in properties) {
                return properties[name];
            }
            const value = isNConf ? target.get(name) : target[name];
            if (value != null) {
                if (isObject(value)) {
                    const proxy = new Proxy(value, createConfigProxyHandler());
                    properties[name] = proxy;
                    return proxy;
                }
                return value;
            }
            return null;
        }
    };
}

const configProxy = new Proxy(config, createConfigProxyHandler(true));

export default configProxy;
