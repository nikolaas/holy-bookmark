import { post } from "../../utils/api.utils";
import { BookmarkDao } from "../../dao/bookmarks.dao";

function registerBookmarks(req, res, next) {
    console.log(`Register bookmark`, req.headers);
    console.log(`Register bookmark`, req.body);
    const bookmarks = req.body.bookmarks;
    BookmarkDao.addBookmarks(bookmarks)
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