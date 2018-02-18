import { Command } from "./command";
import { isArray, isFunction, isString } from "../utils/lang.utils";
import { fillObject } from "../utils/object.utils";
import { createCommandRecognizer, createCommandsRecognizer } from "./command-recognizers";

function createCommand(name, executor, params) {
    if (!name) {
        throw new Error('Command name is missed.');
    }

    if (!executor) {
        throw new Error('Command executor is missed.');
    }

    if (!isFunction(executor)) {
        throw new Error(`Command executor must be function`);
    }

    const command = new Command(name, executor);
    if (params) {
        fillObject(command, params);
    }

    return command;
}

function createRecognizer(source) {
    if (isString(source)) {
        return createCommandRecognizer(source);
    } else if (isArray(source)) {
        return createCommandsRecognizer(source);
    } else if (isFunction) {
        return source;
    } else {
        return null
    }
}

export function command(name, selector, executor, params) {
    const cmd = createCommand(name, executor, params);
    const recognizer = createRecognizer(selector);

    if (recognizer == null) {
        throw new Error(`Command "${name}" has invalid selector. Selector must be string, array of string or function.`);
    }

    return { recognize: recognizer, command: cmd };
}
