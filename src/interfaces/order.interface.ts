import {IGroup} from "./group.interface";
import {IComment} from "./comment.interface";
import {IManager} from "./manager.interface";

export interface IOrder {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    alreadyPaid: number;
    sum: number;
    msg: string;
    status: string;
    manager: IManager | null;
    created_at: string;
    utm: string;
    comments: IComment[];
    group: IGroup;
}