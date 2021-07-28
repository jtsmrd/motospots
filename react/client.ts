import axios from 'axios';

const client = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 10000,
});

const request = (options) => {
    const onSuccess = (response) => {
        return response;
    };
    const onError = (error) => {
        return Promise.reject(error.response || error.message);
    };
    return client(options).then(onSuccess).catch(onError);
};

export { request };
