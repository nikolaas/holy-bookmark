(function (axios) {
    function Api(backendUrl) {
        this.axiosInstance = axios.create({
            withCredentials: true,
            baseURL: backendUrl,
        });
    }

    Api.prototype.login = function login(username, password) {
        return this.axiosInstance.post('/login', { username: username, password: password })
            .then(function (response) {
                localStorage.authToken = response.headers['authorization'];
            });
    };

    Api.prototype.getBookmarks = function getBookmarks() {
        return this.axiosInstance.get('/api/bookmarks', { headers: { 'authorization': localStorage.authToken } })
            .then(function (response) {
                return response.data;
            });
    };

    Api.prototype.deleteBookmark = function deleteBookmark(bookmark) {
        return this.axiosInstance.delete('/api/bookmarks', {
            headers: { 'authorization': localStorage.authToken },
            params: { bookmark: bookmark }
        }).then(function (response) {
            return response.data;
        });
    };

    Api.prototype.isAuthenticated = function isAuthenticated() {
        return localStorage.hasOwnProperty("authToken");
    };

    const BACKEND_URL = 'http:localhost:8080';
    window.holyBookmarkApi = new Api(BACKEND_URL);

})(axios);