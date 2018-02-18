import defaultCommand from './default.command';
import startCommand from './start.command';
import helpCommand from './help.command';
import registerBookmark from './register-bookmark.command';

export const commands = [
    startCommand,
    helpCommand,
    registerBookmark,
];

export { defaultCommand };