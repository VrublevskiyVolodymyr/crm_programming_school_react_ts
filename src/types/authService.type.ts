import {ITokenPair, ITokens, IUser} from "../interfaces";
import {IRes} from "./axiosResp.type";

export type AuthService = {
    login: (cred: ITokenPair) => Promise<IUser>;
    refresh: () => Promise<void>;
    me: () => IRes<IUser>;
    getAccessToken: () => string | null;
    deleteTokens: () => void;
    setTokens: ({accessToken, refreshToken}: ITokens) => void;
    getRefreshToken: () => string | null;
    activate: (token: string, password: string) => IRes<string>;
};