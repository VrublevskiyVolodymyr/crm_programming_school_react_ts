import axios, {AxiosError} from 'axios';
import {createBrowserHistory} from 'history';

import {IWaitListCB} from '../types';
import {baseURL, urls} from "../configs";
import {authService} from "./auth.service";

const axiosService = axios.create({baseURL});
let isRefreshing = false;
const waitList: IWaitListCB[] = [];
const history = createBrowserHistory({window});

axiosService.interceptors.request.use(async (config) => {
    const accessToken = authService.getAccessToken();
    const refreshToken = authService.getRefreshToken();

    if (config.url === urls.auth.refresh && refreshToken) {
        if (config.headers) {
            config.headers.Authorization = `Bearer ${refreshToken}`;
        }
    } else if (config.url === urls.auth.activate) {
        if (config.headers?.Authorization) {
            return config;
        }
    } else if (accessToken) {
        if (config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});


axiosService.interceptors.response.use(
    (res) => {
        return res;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;
        if (error.response?.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await authService.refresh();
                    isRefreshing = false;
                    afterRefresh();
                    return axiosService(originalRequest);
                } catch (e) {
                    authService.deleteTokens();
                    isRefreshing = false;
                    history.replace('/login?expSession=true');
                    return Promise.reject(error);
                }
            }

            if (originalRequest.url === urls.auth.refresh) {
                return Promise.reject(error);
            }

            return new Promise((resolve) => {
                subscribeToWaitList(() => resolve(axiosService(originalRequest)));
            });
        }
        return Promise.reject(error);
    }
);

const subscribeToWaitList = (cb: IWaitListCB): void => {
    waitList.push(cb);
};

const afterRefresh = () => {
    while (waitList.length) {
        const cb = waitList.pop();
        cb?.();
    }
};

export {axiosService, history};