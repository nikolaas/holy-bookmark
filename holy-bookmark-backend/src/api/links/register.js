import { post } from "../../utils/api.utils";
import { isString } from "../../utils/lang.utils";
import { Link } from "../../models/link";
import { linksService } from "../../service/links.service";

function registerLinks(req, res, next) {
    const links = req.body.bookmarks.map(linkData => {
        const link = new Link();
        link.url = isString(linkData) ? linkData : linkData.url;
        link.name = isString(linkData) ? null : linkData.name;
        link.creationTs = new Date();
        return link;
    });

    linksService.register(links)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            next(error);
        });
}

export default post({
    path: '/links',
    authenticated: true,
    handler: registerLinks,
})