const bookmarks = [];

function getBookmarks() {
    return Promise.resolve(bookmarks);
}

function addBookmarks(newBookmarks) {
    newBookmarks.forEach(newBookmark => {
        if (bookmarks.indexOf(newBookmark) < 0) {
            bookmarks.push(newBookmark);
        }
    });
    return Promise.resolve();
}

function deleteBookmark(bookmark) {
    const index = bookmarks.indexOf(bookmark);
    if (index >= 0) {
        bookmarks.splice(index, 1);
        return Promise.resolve(bookmark);
    }
    return Promise.resolve();
}

export const BookmarkDao = {
    getBookmarks,
    addBookmarks,
    deleteBookmark,
};
