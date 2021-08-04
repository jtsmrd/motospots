import axios from 'axios';
import {API_PORT} from "./constants/Environment";


const client = axios.create({
    baseURL: `https://127.0.0.1:${API_PORT}`,
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
