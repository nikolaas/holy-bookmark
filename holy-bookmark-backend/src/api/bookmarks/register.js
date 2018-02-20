import { post } from "../../utils/api.utils";
import { isString } from "../../utils/lang.utils";
import { Bookmark } from "../../models/bookmark";
import { bookmarksService } from "../../service/bookmarks.service";

function registerBookmarks(req, res, next) {
    const bookmarks = req.body.bookmarks.map(bookmarkData => {
        const bookmark = new Bookmark();
        bookmark.url = isString(bookmarkData) ? bookmarkData : bookmarkData.url;
        bookmark.name = isString(bookmarkData) ? null : bookmarkData.name;
        bookmark.createionTs = new Date();
        return bookmark;
    });

    bookmarksService.register(bookmarks)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            next(error);
        });
}

export default post({
    path: '/bookmarks',
    authenticated: true,
    handler: registerBookmarks,
})