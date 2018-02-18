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

    console.log(`Received ${urls.length} url(s): ${urls.map(url => `"${url}"`).join(', ')}`);
    console.log('Sending url(s)to backend');
    addBookmarks(urls)
        .then(() => {
            bot.sendMessage(message.chat.id, 'I got it');
        })
        .catch(error => {
            bot.sendMessage(message.chat.id, 'Sorry, my master is busy. Try later, please.');
            console.log('Sending bookmarks to backend failed: ', error)
        })

}

export default command('register-bookmark', selector, registerBookmark);