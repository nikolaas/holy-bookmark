import { command } from "../core";

const response = () => 'Send me a message contain url and I will give it to my master.';

export default command('help', '/help', (bot, message) => {
    bot.sendMessage(message.chat.id, response());
})