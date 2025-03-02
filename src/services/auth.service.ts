import {AxiosResponse} from 'axios';

import {AuthService, IRes} from '../types';
import {urls} from "../configs";
import {ITokenPair, ITokens, IUser} from "../interfaces";
import {axiosService} from "./axios.service";


const authService: AuthService = {


    login: async (cred: ITokenPair): Promise<IUser> => {
        try {
            const {data}: AxiosResponse<ITokens> = await axiosService.post(urls.auth.auth(), cred);
            authService.setTokens(data);
            const {data: user}: AxiosResponse<IUser> = await authService.me();
            return user;
        } catch (error) {
            throw error;
        }
    },

    refresh: async (): Promise<void> => {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
            throw new Error("Refresh token isn't exists");
        }
        try {
            const {data}: AxiosResponse<ITokens> = await axiosService.post(urls.auth.refresh, {
                refresh: refreshToken,
            });
            authService.setTokens(data);
        } catch (error) {
            throw new Error('Refresh failed');
        }
    },

    me: (): IRes<IUser> => {
        return axiosService.get(urls.me);
    },

    getAccessToken: (): string | null => {
        return localStorage.getItem('accessToken');
    },

    deleteTokens: (): void => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    setTokens: ({accessToken, refreshToken}: ITokens): void => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },


    getRefreshToken: (): string | null => {
        return localStorage.getItem('refreshToken');
    },

    activate: (token: string, password: string): IRes<string> => {
        return axiosService.post(
            urls.auth.activate,
            {password},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

};

export {authService};
