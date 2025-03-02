import {FC} from 'react';
import {Outlet} from "react-router-dom";

import {Footer, Header} from '../components';
import css from './mainLayout.module.css'
import {useAppSelector} from "../hooks";

interface IProps {

}

const MainLayout: FC<IProps> = () => {
    const {me} = useAppSelector(state => state.authReducer);

    return (
        <div className={css.container}>
            <Header/>
            <Outlet/>
            {me && <Footer/>}
        </div>
    );
};

export {MainLayout};