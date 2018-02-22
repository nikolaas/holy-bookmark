import moment from "moment";
import { toPairs } from "ramda";
import { authenticated } from "../modules/security";
import { DATE_FORMATS } from "../utils/date.utils";
import { getPropertyType } from "./object.utils";

const HTTP_METHODS = ['get', 'post', 'patch', 'delete'];

function quotedList(arr) {
    return arr.map(item => `"${item}"`).join(', ');
}

export function registerMethods(router, ...descriptors) {
    descriptors.forEach(descriptor => {
        const httpMethod = descriptor.method;
        const path = descriptor.path;
        const middlewares = [];
        if (descriptor.authenticated) {
            middlewares.push(authenticated());
        }
        router[httpMethod](path, ...middlewares, descriptor.handler);
        console.log(`Register api method ${httpMethod.toUpperCase()} ${path}`);
    });
}

function createApiMethodDescriptor(config) {
    if (!config.method) {
        throw new Error(`Required property "method" is missing for api method`);
    }
    const method = config.method.toLowerCase();
    if (HTTP_METHODS.indexOf(method) < 0) {
        throw new Error(`Unexpected method "${method}" specified for api method. Expect ${quotedList(HTTP_METHODS)}`);
    }
    if (!config.path) {
        throw new Error(`Required property "path" is missing for api method`);
    }
    if (!config.handler) {
        throw new Error(`Required property "handler" is missing for api method`);
    }
    return {
        ...config,
        method
    }
}

export function get(config) {
    return createApiMethodDescriptor({
        ...config,
        method: 'GET'
    });
}

export function post(config) {
    return createApiMethodDescriptor({
        ...config,
        method: 'POST'
    });
}

export function patch(config) {
    return createApiMethodDescriptor({
        ...config,
        method: 'PATCH'
    });
}

export function del(config) {
    return createApiMethodDescriptor({
        ...config,
        method: 'DELETE'
    });
}

function parseValue(type, value, options = {}) {
    if (value == null) {
        return null;
    }
    switch (type) {
        case 'string': return String(value);
        case 'number': return parseInt(value, 10);
        case 'boolean': return value === 'true';
        case 'date': return moment(value, options.dateFormat || DATE_FORMATS.COMMON).toDate();
        default: return value;
    }
}

export function queryToObject(Constructor, query = {}, options) {
    return toPairs(query)
        .map(([param, value]) => {
            const type = getPropertyType(Constructor, param);

            if (!type) {
                return null;
            }

            return { prop: param, value: parseValue(type, value, options)}
        })
        .reduce((accumulator, { prop, value }) => ({ ...accumulator, [prop]: value }), {})
}
