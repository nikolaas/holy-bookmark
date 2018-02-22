import { linksDao } from "../dao/links.dao";

function createNotExistedLinkFilter(existedLinks) {
    const existedUrls = existedLinks.map(link => link.url);
    return link => {
        return existedUrls.indexOf(link.url) < 0;
    };
}

class LinksService {

    register(links) {
        return linksDao.getLinks()
            .then(createNotExistedLinkFilter)
            .then(notExistedLinksFilter => {
                return linksDao.addLinks(links.filter(notExistedLinksFilter));
            });
    }

    getLinks(query) {
        const { prop, order, ...filter } = query;
        const sorting = { prop, order };
        return linksDao.getLinks(sorting, filter);
    }

    getLinksCount(query) {
        return this.getLinks(query).then(links => links.length);
    }

    deleteLink(linkId) {
        return linksDao.deleteLink(linkId);
    }

}

export const linksService = new LinksService();
