export class Link {

    static typeMapping = {
        id: 'string',
        url: 'string',
        name: 'string',
        creationTs: 'date',
        viewed: 'boolean',
    };

    constructor() {
        this.id = null;
        this.url = null;
        this.name = null;
        this.creationTs = null;
        this.viewed = false;
    }

}
