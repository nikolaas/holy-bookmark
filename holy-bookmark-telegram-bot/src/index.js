import './promise-fix';
import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import { commands, defaultCommand } from './commands';
import { registerCommands, registerDefaultCommand, recognizeCommand } from './core';

const token = config.telegram.bot.token;
const bot = new TelegramBot(token, {polling: true});

registerCommands(commands);
registerDefaultCommand(defaultCommand);

bot.on('message', function (msg) {
	try {
	    console.log('Incoming message', msg);
    	const command = recognizeCommand(msg);
		command.execute(bot, msg);
	} catch (error) {
		console.error(error);
	}
});

console.log('HolyBookmark Telegram Bot started.');