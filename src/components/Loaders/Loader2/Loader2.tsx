import {FC} from 'react';

import tridentImage from "./../../../images/ukrainian_trident.jpg";
import css from "../Loader2/loader2.module.css";


interface IProps {

}

const Loader2: FC<IProps> = () => {
    return (
        <div className={css.loader_container}>
            <div className={css.loader}>
                <div className={css.loaderInner}></div>
                <div className={css.loaderImage}>
                    <img src={tridentImage} alt="Trident" className={css.image}/>
                </div>
            </div>
        </div>
    );
};

export {Loader2};