(function (api) {

    var bookmarksPooling;

    function fetchBookmarks() {
        console.log('Fetching bookmarks...');
        return api.getNewBookmarksCount()
            .then(bookmarksCount => {
                const normalizedBookmarksCount = Math.min(bookmarksCount, 999);
                console.log('Fetched ' + normalizedBookmarksCount + ' bookmark(s)');
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [255, 0, 0, 255]
                });
                chrome.browserAction.setBadgeText({
                    text: normalizedBookmarksCount > 0 ? String(normalizedBookmarksCount) : ''
                });
            });
    }
    
    function runBookmarksPooling() {
        fetchBookmarks().finally(function () {
            bookmarksPooling = setInterval(fetchBookmarks, 5000);
        });
    }

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