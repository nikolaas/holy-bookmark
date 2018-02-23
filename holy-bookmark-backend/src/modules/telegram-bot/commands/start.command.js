import { command } from "../core";

const response = ({ from }) => `
Hi, ${from.first_name} ${from.last_name}. My name is HolyBookmark. I am telegram bot. 
I live and exist for help my master in managing a bookmarks.
Send me a message contain url and I will give it to my master.
`;

export default command('start', '/start', (bot, message) => {
    bot.sendMessage(message.chat.id, response({ from: message.from }));
});