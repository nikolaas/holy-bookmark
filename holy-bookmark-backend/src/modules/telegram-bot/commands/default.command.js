import { command } from "../core";

const response = ({ from }) => `
${from.first_name}, thanks for your message but it does not contain links so I can not do anything. 
Send me a message with a link and I will give it to my master.
`;

export default command('default', '/default', (bot, message) => {
    bot.sendMessage(message.chat.id, response({ from: message.from }));
})