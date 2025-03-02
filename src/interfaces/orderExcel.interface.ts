import {IManager} from "./manager.interface";
import {IComment} from "./comment.interface";
import {IGroup} from "./group.interface";

export interface IOrderExcel {
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
    created: string;
    utm: string;
    comments: IComment[];
    group: IGroup;
}
