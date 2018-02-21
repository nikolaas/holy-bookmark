import axios from 'axios';
import config from '../config';
import { AuthInterceptor } from './auth-interceptor';

const api = axios.create({
    withCredentials: true,
    baseURL: config.backend.url,
});

// Add a response interceptor
const authInterceptor = new AuthInterceptor();
api.interceptors.request.use(authInterceptor.interceptRequest);
api.interceptors.response.use(authInterceptor.interceptResponse);

const urls = {
    login: `/login`,
    addBookmarks: `/api/links`,
};

const login = () => {
    return api.post(urls.login, {
        username: config.backend.username,
        password: config.backend.password,
    });
};

const addBookmarks = bookmarks => {
    return api.post(urls.addBookmarks, { bookmarks })
        .catch(error => {
            console.log(`Error when try add bookmarks`, error.message);
            if (error.response && error.response.status === 401) {
                console.log(`Logining...`);
                return login().then(() => {
                    console.log(`Logined`);
                    console.log(`Retry send bookmark to backend`);
                    return addBookmarks(bookmarks)
                });
            }
            return Promise.reject(error);
        });
};

export {
    addBookmarks
}