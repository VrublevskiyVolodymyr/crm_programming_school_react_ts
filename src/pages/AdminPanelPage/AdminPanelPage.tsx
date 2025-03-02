import {FC} from 'react';

import {Managers} from "../../components";
import css from './adminPanelPage.module.css'

interface IProps {

}

const AdminPanelPage: FC<IProps> = () => {
    return (
        <div className={css.container}>
            <Managers/>
        </div>
    );
};

export {AdminPanelPage};