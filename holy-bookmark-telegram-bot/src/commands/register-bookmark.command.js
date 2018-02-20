import { command } from "../core";
import { addBookmarks } from "../api";

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

    console.log(`Received ${urls.length} url(s): ${urls.map(url => `"${url}"`).join(', ')}`);
    console.log('Sending url(s)to backend');
    addBookmarks([{ name, url }])
        .then(() => {
            bot.sendMessage(message.chat.id, 'I got it');
        })
        .catch(error => {
            bot.sendMessage(message.chat.id, 'Sorry, my master is busy. Try later, please.');
            console.log('Sending bookmarks to backend failed: ', error)
        })

}

export default command('register-bookmark', selector, registerBookmark);
