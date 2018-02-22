import { createSorter } from "../../../utils/sort.utils";
import { getPropertyType } from "../../../utils/object.utils";
import { Link } from "../models/link";
import { AbstractStore } from "../../../core/db";

class LinksDao extends AbstractStore {

    static sort(sorting) {
        const prop = sorting.prop || 'creationTs';
        const order = sorting.order || 'asc';
        const type = getPropertyType(Link, prop);
        const sorter = createSorter(prop, type, order);
        return links => [...links].sort(sorter);
    }

    constructor() {
        super('links');
    }

    getLinks(sorting = {}, filter = {}) {
        return this.get(filter).then(LinksDao.sort(sorting));
    }

    addLinks(links) {
        return this.create(links.map(LinksDao.generateId));
    }

    deleteLink(id) {
        return this.delete({ id });
    }

}

export const linksDao = new LinksDao();
