import Bot from 'node-telegram-bot-api';
import config from '../../config';

export function createBot() {
    if(process.env.NODE_ENV === 'production') {
        const bot = new Bot(config.get('telegramBot.token'));
        return bot.setWebHook(config.get('telegramBot.webHook') + bot.token).then(() => bot);
    } else {
        return Promise.resolve(new Bot(config.get('telegramBot.token'), { polling: true }));
    }
}
