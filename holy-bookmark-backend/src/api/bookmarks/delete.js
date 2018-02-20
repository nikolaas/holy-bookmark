import { del } from "../../utils/api.utils";
import { bookmarksService } from "../../service/bookmarks.service";

function deleteBookmarks(req, res, next) {
    bookmarksService.deleteBookmark(req.params.bookmarkId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            next(error);
        });
}

export default del({
    path: '/bookmarks/:bookmarkId',
    authenticated: true,
    handler: deleteBookmarks,
})