import { del } from "../../utils/api.utils";
import { BookmarkDao } from "../../dao/bookmarks.dao";

function deleteBookmarks(req, res, next) {
    const bookmark = req.query.bookmark;
    console.log(`Delete bookmark`, req.query);
    console.log(`Delete bookmark ${bookmark}`);
    BookmarkDao.deleteBookmark(bookmark)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            next(error);
        });
}

export default del({
    path: '/bookmarks',
    authenticated: true,
    handler: deleteBookmarks,
})