import { BookmarkDao } from "../dao/bookmarks.dao";

function createNotExistedBookmarkFilter(existedBookmarks) {
    const existedUrls = existedBookmarks.map(bookmark => bookmark.url);
    return bookmark => {
        return existedUrls.indexOf(bookmark.url) < 0;
    };
}

class BookmarksService {

    register(bookmarks) {
        return BookmarkDao.getBookmarks()
            .then(createNotExistedBookmarkFilter)
            .then(notExistedBookmarksFilter => {
                return bookmarks.filter(notExistedBookmarksFilter);
            })
            .then(newBookmarks => {
                return BookmarkDao.addBookmarks(newBookmarks);
            });
    }

    getBookmarks(query) {
        const { prop, order, ...filter } = query;
        const sorting = { prop, order };
        return BookmarkDao.getBookmarks(sorting, filter);
    }

    getBookmarksCount(query) {
        return this.getBookmarks(query).then(bookmarks => bookmarks.length);
    }

    deleteBookmark(bookmarkId) {
        return BookmarkDao.deleteBookmark(bookmarkId);
    }

}

export const bookmarksService = new BookmarksService();
