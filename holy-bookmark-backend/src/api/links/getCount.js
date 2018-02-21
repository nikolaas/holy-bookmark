import { get, queryToObject } from "../../utils/api.utils";
import { Link } from "../../models/link";
import { linksService } from "../../service/links.service";

function getLinksCount(req, res, next) {
    linksService.getLinksCount(queryToObject(Link, req.query))
        .then(count => {
            res.json(count);
        })
        .catch(error => {
            next(error);
        });
}

export default get({
    path: '/links/count',
    authenticated: true,
    handler: getLinksCount,
})