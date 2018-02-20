import { get, queryToObject } from "../../utils/api.utils";
import { Bookmark } from "../../models/bookmark";
import { bookmarksService } from "../../service/bookmarks.service";

function getBookmarksCount(req, res, next) {
    bookmarksService.getBookmarksCount(queryToObject(Bookmark, req.query))
        .then(count => {
            res.json(count);
        })
        .catch(error => {
            next(error);
        });
}

export default get({
    path: '/bookmarks/count',
    authenticated: true,
    handler: getBookmarksCount,
})