import {FC} from 'react';

import {Error} from "../../components";
import css from "./errorPage.module.css"

interface IProps {

}

const ErrorPage: FC<IProps> = () => {
    const errorMessage: string = "Something went wrong! Please try again later.";

    return (
        <div className={css.container}>
            <Error message={errorMessage}/>
        </div>
    );
};

export {ErrorPage};