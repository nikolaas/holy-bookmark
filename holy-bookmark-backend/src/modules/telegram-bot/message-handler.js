import { commands, defaultCommand } from './commands';
import { registerCommands, registerDefaultCommand, recognizeCommand } from './core';

registerCommands(commands);
registerDefaultCommand(defaultCommand);

export const createMessageHandler = bot => message => {
    try {
        console.log('Incoming message', message);
        const command = recognizeCommand(message);
        command.execute(bot, message);
    } catch (error) {
        console.error(error);
    }
};