export class AuthInterceptor {

    constructor() {
        this.authorization = null;

        this.interceptRequest = this.interceptRequest.bind(this);
        this.interceptSuccessResponse = this.interceptSuccessResponse.bind(this);
        this.interceptErrorResponse = this.interceptErrorResponse.bind(this);
    }

    interceptRequest(request) {
        if (!request.headers[request.method]['authorization'] && this.authorization) {
            request.headers[request.method]['authorization'] = this.authorization;
        }
        return request.data;
    }

    interceptSuccessResponse(response) {
        if (response.headers['authorization']) {
            this.authorization = response.headers['authorization'];
        }
        return response;
    }

    interceptErrorResponse(config) {
        if (config.response && config.response.status === 401) {
            this.authorization = null;
        }
        return Promise.reject(config.response);
    }
}
