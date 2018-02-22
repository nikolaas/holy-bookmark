import { get } from "../../../utils/api.utils";
import { linksService } from "../services/links.service";

function getLinks(req, res, next) {
    linksService.getLinks(req.query)
        .then(links => {
            res.json(links);
        })
        .catch(error => {
            next(error);
        });
}

export default get({
    path: '/links',
    authenticated: true,
    handler: getLinks,
})