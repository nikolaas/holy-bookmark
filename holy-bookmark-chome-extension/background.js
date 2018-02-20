(function (api) {

    var bookmarksPooling;

    function fetchBookmarks() {
        console.log('Fetching bookmarks...');
        return api.getBookmarks()
            .then(bookmarks => {
                const bookmarksCount = Math.min(bookmarks.length, 999);
                console.log('Fetched ' + bookmarksCount + ' bookmark(s)');
                chrome.browserAction.setBadgeText({
                    text: bookmarksCount > 0 ? String(bookmarksCount) : ''
                });
            });
    }
    
    function runBookmarksPooling() {
        bookmarksPooling = setInterval(fetchBookmarks, 5000);
    }

    // chrome.browserAction.setBadgeBackgroundColor({
    //     color: [255, 0, 0, 255]
    // });

    if (api.isAuthenticated()) {
        console.log('Start pooling for bookmarks');
        runBookmarksPooling();
    } else {
        console.log('User is not authenticated. Waiting for authentication...');
        chrome.runtime.onMessage.addListener(function(message) {
            if (message.type === 'holy-bookmark-authentication-success') {
                console.log('User authenticated. Start pooling for bookmarks');
                fetchBookmarks().finally(runBookmarksPooling);
            }
        });
    }
    
})(holyBookmarkApi);