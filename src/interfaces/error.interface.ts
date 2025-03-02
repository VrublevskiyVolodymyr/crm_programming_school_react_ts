export interface IError {
    detail?: string
}

export interface IErrorAuth extends IError {
    error: string;
    code: number;
    details: string[] | null;
}