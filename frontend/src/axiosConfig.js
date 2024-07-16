import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Adjust the URL if necessary
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
            console.log('Authorization Header:', config.headers['Authorization']);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
