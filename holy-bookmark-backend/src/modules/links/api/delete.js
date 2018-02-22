import { del } from "../../../utils/api.utils";
import { linksService } from "../services/links.service";

function deleteLink(req, res, next) {
    linksService.deleteLink(req.params.linkId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            next(error);
        });
}

export default del({
    path: '/links/:linkId',
    authenticated: true,
    handler: deleteLink,
})