import {FC} from 'react';
import {createBrowserHistory} from 'history';

import {LoginForm} from "../../components";
import {useAppSelector} from "../../hooks";
import {authService} from "../../services";
import {OrderPage} from "../OrderPage/OrderPage";
import css from './login.module.css'

interface IProps {

}

const LoginPage: FC<IProps> = () => {

    const history = createBrowserHistory({window});
    const {me} = useAppSelector(state => state.authReducer);
    const accessToken = authService.getAccessToken();

    if (me && authService.getAccessToken()) {
        history.replace('/orders');
    }


    return (
        <div>
            {
                !accessToken ?

                    <div className={css.loginPage}>
                        <LoginForm/>
                    </div>
                    :
                    <OrderPage/>
            }
        </div>
    );
};

export {LoginPage};