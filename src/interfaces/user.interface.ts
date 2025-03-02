export interface IUser {
    id: string,
    name: string,
    surname: string,
    email: string,
    "is_active": boolean,
    "is_superuser": boolean,
    "is_staff": boolean,
    "last_login": Date
}