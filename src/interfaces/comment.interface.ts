export interface IComment {
    id: string;
    comment: string;
    created_at: string;
    order_id: number,
    manager: {
        id: string,
        name: string,
        surname: string,
        email: string
    }
}