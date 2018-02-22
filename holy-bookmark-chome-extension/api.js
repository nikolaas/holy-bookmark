(function (axios) {

    function LocalStorageAuthToken() {}

    LocalStorageAuthToken.prototype.hasAuthToken = function hasAuthToken() {
        return localStorage.hasOwnProperty("authToken");
    };

    LocalStorageAuthToken.prototype.getAuthToken = function getAuthToken() {
        return localStorage.authToken;
    };

    LocalStorageAuthToken.prototype.saveAuthToken = function saveAuthToken(authToken) {
        localStorage.authToken = authToken;
    };

    LocalStorageAuthToken.prototype.removeAuthToken = function removeAuthToken() {
        localStorage.removeItem('authToken');
    };

    function AuthInterceptor(authTokenStorage) {
        this.authTokenStorage = authTokenStorage;

        this.interceptRequest = this.interceptRequest.bind(this);
        this.interceptSuccessResponse = this.interceptSuccessResponse.bind(this);
        this.interceptErrorResponse = this.interceptErrorResponse.bind(this);
    }

    AuthInterceptor.prototype.interceptRequest = function interceptRequest(request) {
        const authToken = this.authTokenStorage.getAuthToken();
        if (!request.headers[request.method]['authorization'] && authToken) {
            request.headers[request.method]['authorization'] = authToken;
        }
        return request;
    };

    AuthInterceptor.prototype.interceptSuccessResponse = function interceptSuccessResponse(response) {
        if (response.headers['authorization']) {
            this.authTokenStorage.saveAuthToken(response.headers['authorization']);
        }
        return response.data;
    };

    AuthInterceptor.prototype.interceptErrorResponse = function interceptErrorResponse(config) {
        if (config.response && config.response.status === 401) {
            this.authTokenStorage.removeAuthToken();
        }
        return Promise.reject(config.response);
    };

    function Api(backendUrl, authTokenStorage) {
        this.axiosInstance = axios.create({
            withCredentials: true,
            baseURL: backendUrl,
        });

        this.authTokenStorage = authTokenStorage;
        // Add a response interceptor
        const authInterceptor = new AuthInterceptor(this.authTokenStorage);
        this.axiosInstance.interceptors.request.use(authInterceptor.interceptRequest);
        this.axiosInstance.interceptors.response.use(authInterceptor.interceptSuccessResponse, authInterceptor.interceptErrorResponse);
    }

    Api.prototype.login = function login(username, password) {
        return this.axiosInstance.post('/login', { username: username, password: password });
    };

    Api.prototype.getBookmarks = function getBookmarks() {
        return this.axiosInstance.get('/api/links', { params: { order: 'desc' } });
    };

    Api.prototype.getNewBookmarksCount = function getNewBookmarksCount() {
        return this.axiosInstance.get('/api/links/count', { params: { viewed: false } });
    };

    Api.prototype.deleteBookmark = function deleteBookmark(bookmarkId) {
        return this.axiosInstance.delete('/api/links/' + bookmarkId);
    };

    Api.prototype.isAuthenticated = function isAuthenticated() {
        return this.authTokenStorage.hasAuthToken();
    };

    const BACKEND_URL = 'http:localhost:8080';
    window.holyBookmarkApi = new Api(BACKEND_URL, new LocalStorageAuthToken());

})(axios);