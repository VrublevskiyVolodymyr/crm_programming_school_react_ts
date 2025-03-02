import {IStatus} from "./status.interface";

export interface IStatistic {
    total_count: number;
    statuses: IStatus[];
}
