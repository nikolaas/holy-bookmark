(function (axios) {

    function LocalStorageAuthToken() {}

    LocalStorageAuthToken.prototype.hasAuthToken = function hasAuthToken() {
        return localStorage.hasOwnProperty("authToken");
    };

    LocalStorageAuthToken.prototype.getAuthToken = function getAuthToken() {
        return localStorage.authToken;
    };

    LocalStorageAuthToken.prototype.saveAuthToken = function saveAuthToken(AuthToken) {
        localStorage.authToken = AuthToken;
    };

    function AuthInterceptor(authTokenStorage) {
        this.authTokenStorage = authTokenStorage;

        this.interceptRequest = this.interceptRequest.bind(this);
        this.interceptResponse = this.interceptResponse.bind(this);
    }

    AuthInterceptor.prototype.interceptRequest = function interceptRequest(request) {
        const authToken = this.authTokenStorage.getAuthToken();
        if (!request.headers[request.method]['authorization'] && authToken) {
            request.headers[request.method]['authorization'] = authToken;
        }
        return request;
    };

    AuthInterceptor.prototype.interceptResponse = function interceptResponse(response) {
        if (response.headers['authorization']) {
            this.authTokenStorage.saveAuthToken(response.headers['authorization']);
            this.authorization = response.headers['authorization'];
        }
        return response.data;
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
        this.axiosInstance.interceptors.response.use(authInterceptor.interceptResponse);
    }

    Api.prototype.login = function login(username, password) {
        return this.axiosInstance.post('/login', { username: username, password: password })
            .then(function (response) {
                localStorage.authToken = response.headers['authorization'];
            });
    };

    Api.prototype.getBookmarks = function getBookmarks() {
        return this.axiosInstance.get('/api/bookmarks', { params: { order: 'desc' } });
    };

    Api.prototype.getNewBookmarksCount = function getNewBookmarksCount() {
        return this.axiosInstance.get('/api/bookmarks/count', { params: { viewed: false } });
    };

    Api.prototype.deleteBookmark = function deleteBookmark(bookmark) {
        return this.axiosInstance.delete('/api/bookmarks/' + bookmark.id);
    };

    Api.prototype.isAuthenticated = function isAuthenticated() {
        return this.authTokenStorage.hasAuthToken();
    };

    const BACKEND_URL = 'http:localhost:8080';
    window.holyBookmarkApi = new Api(BACKEND_URL, new LocalStorageAuthToken());

})(axios);