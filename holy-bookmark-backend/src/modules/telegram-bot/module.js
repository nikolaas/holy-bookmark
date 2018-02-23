import { module } from '../../core/modules';
import { createBot } from './bot-factory';
import { createMessageHandler } from './message-handler';

function telegramBotModule({ app }) {
    return createBot()
        .then(bot => {
            bot.on('message', createMessageHandler(bot));

            // If pooling mechanism used messages will be directly sent to telegram bot.
            // If web hook used messages will be sent to web server and we need explicit transfer their to bot
            app.post('/' + bot.token, (req, res) => {
                bot.processUpdate(req.body);
                res.sendStatus(200);
            });
            console.error(`Telegram bot started in ${process.env.NODE_ENV} mode`);
        })
        .catch(error => {
            console.error('Starting telegram bot failed with error', error);
        });
}

export default module('telegramBot', telegramBotModule);
