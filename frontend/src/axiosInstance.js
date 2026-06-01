import axios from 'axios';

const config = {
    baseURL: 'http://localhost:8080',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
};

const _axios = axios.create(config);


_axios.interceptors.request.use(
    (request) => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            request.headers.Authorization = `Bearer ${jwt}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);

_axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwt');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default _axios;
