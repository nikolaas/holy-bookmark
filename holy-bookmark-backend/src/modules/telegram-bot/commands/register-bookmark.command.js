import { command } from "../core";
import { linksService } from "../../links/services/links.service";

function urlEntityFilter() {
    return entity => entity.type === 'url';
}

const extractUrl = text => entity => {
    return text.substring(entity.offset, entity.offset + entity.length + 1);
};

function selector(message) {
    if (!message.entities) {
        return false;
    }
    return message.entities.filter(urlEntityFilter).length > 0;
}

function registerBookmark(bot, message) {
    const urls = message.entities
        .filter(urlEntityFilter)
        .map(extractUrl(message.text));

    if (urls .length === 0) {
        bot.sendMessage(message.chat.id, 'I got it but do not see the link in your message.');
        return;
    }

    // usually a message contains article's title with a link following it
    // but sometimes article's title contains text like 'google.com' or etc
    // so we consider only last url as article's link
    const url = urls[urls.length - 1];
    const entity = message.entities[message.entities.length - 1];
    const name = message.text.substring(0, entity.offset).trim();

    const links = [{ name, url }];
    linksService.register(links)
        .then(() => {
            console.log('Registered links', links);
            bot.sendMessage(message.chat.id, 'I got it');
        })
        .catch(error => {
            console.error('Registration of links failed with error', error);
            bot.sendMessage(message.chat.id, 'Sorry, I do not feel very well. Try later, please.');
        })

}

export default command('register-bookmark', selector, registerBookmark);
