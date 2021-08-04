import axios from 'axios';
import {API_URL} from "./constants/Environment";


const client = axios.create({
    baseURL: API_URL,
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
