import { get } from "../../utils/api.utils";
import { BookmarkDao } from "../../dao/bookmarks.dao";

function getBookmarks(req, res, next) {
    BookmarkDao.getBookmarks()
        .then(bookmarks => {
            res.json(bookmarks);
        })
        .catch(error => {
            next(error);
        });
}

export default get({
    path: '/bookmarks',
    authenticated: true,
    handler: getBookmarks,
})