import {IOrder} from "./order.interface";

export interface IOrderPainted {
    total_items: number;
    total_pages: number;
    prev: string;
    next: string;
    items: IOrder[];
}