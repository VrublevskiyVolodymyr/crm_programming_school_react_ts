import {IUser} from "./user.interface";

export interface IManagerPainted {
    total_items: number;
    total_pages: number;
    prev: string;
    next: string;
    data: IUser[];
}