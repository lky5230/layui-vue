import axios from 'axios'
import Vue from 'vue'

let instance = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,
});

instance.interceptors.request.use(
    function (config) {
        config.headers['Authorization'] = 'token-test-0111111111111111111111111';

        return config;
    }, 
    function (error) {
        console.error(error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.error(error);
    return Promise.reject(error);
});

Vue.prototype.$http = instance;
