import {FC} from 'react';

import css from "./loader1.module.css"

interface IProps {

}

const Loader1: FC<IProps> = () => {
    return (
        <div className={css.loader_container}>
            <div className={css.loader}>
                <div className={css.loaderInner}></div>
                <div className={css.loaderText}>loading</div>
            </div>
        </div>
    );
};

export {Loader1};