export class AuthInterceptor {

    constructor() {
        this.authorization = null;

        this.interceptRequest = this.interceptRequest.bind(this);
        this.interceptResponse = this.interceptResponse.bind(this);
    }

    interceptRequest(request) {
        if (!request.headers[request.method]['authorization'] && this.authorization) {
            request.headers[request.method]['authorization'] = this.authorization;
        }
        return request;
    }

    interceptResponse(response) {
        if (response.headers['authorization']) {
            this.authorization = response.headers['authorization'];
        }
        return response;
    }
}
