import {IRes} from "../types";

import {axiosService} from "./axios.service";
import {urls} from "../configs";
import {IActionToken, IManager, IManagerPainted, IStatistic, IUser} from "../interfaces";

const adminService = {
    getAllManagers: (page: number, limit: number): IRes<IManagerPainted> => axiosService.get(urls.admin.users, {
        params: {
            page,
            limit
        }
    }),

    createManager: (data: IManager): IRes<IUser> => axiosService.post(urls.admin.users, data),

    reToken: (id: string): IRes<IActionToken> => axiosService.post(urls.admin.re_token(id)),

    banManager: (id: string) => axiosService.patch(urls.admin.ban(id)),

    unbanManager: (id: string) => axiosService.patch(urls.admin.unban(id)),

    statisticAll: (): IRes<IStatistic> => axiosService.get(urls.admin.statisticAll),

    statisticByManagerId: (id: string) => axiosService.get(urls.admin.statisticByManagerId(id))

}


export {adminService}