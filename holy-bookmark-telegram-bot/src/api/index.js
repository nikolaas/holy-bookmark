import axios from 'axios';
import config from '../config';

function headersLogger(headers) {
    Object.keys(headers).forEach(header => {
        console.log(`${header}=${headers[header]}`);
    });
}

const api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8080',
});

// Add a response interceptor
api.interceptors.response.use(function (response) {
    // Do something with response data
    console.log('Response headers');
    headersLogger(response.headers);
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

const urls = {
    login: `/login`,
    addBookmarks: `/api/bookmarks`,
};

const login = () => {
    const data = {
        username: config.backend.username,
        password: config.backend.password,
    };
    return api.post(urls.login, data).then(response => {
        return response;
    });
};

const addBookmarks = bookmarks => {
    return api.post(urls.addBookmarks, { bookmarks })
        .catch(error => {
            console.log(`Error when try add bookmarks`, error);
            if (error.response.status === 401) {
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