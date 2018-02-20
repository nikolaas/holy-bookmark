import { get } from "../../utils/api.utils";
import { bookmarksService } from "../../service/bookmarks.service";

function getBookmarks(req, res, next) {
    bookmarksService.getBookmarks(req.query)
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