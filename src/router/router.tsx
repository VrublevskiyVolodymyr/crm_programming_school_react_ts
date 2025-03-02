import {createBrowserRouter, Navigate} from "react-router-dom";


import {MainLayout} from "../layouts";
import {ActivatePage, AdminPanelPage, ErrorPage, LoginPage, OrderPage} from "../pages";
import {RequiredAuth} from "../hoс";
import {useAppSelector} from "../hooks";

const AdminRoute = () => {
    const {me} = useAppSelector(state => state.authReducer);

    return me?.is_superuser ? <AdminPanelPage/> : <Navigate to="/orders"/>;
};

const router = createBrowserRouter([
    {
        path: '',
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <Navigate to={'orders'}/>
            },
            {
                path: 'login',
                element: <LoginPage/>
            },
            {
                path: 'activate/:token',
                element: <ActivatePage/>
            },
            {
                path: 'orders',
                element: (
                    <RequiredAuth>
                        <OrderPage/>
                    </RequiredAuth>
                )
            },
            {
                path: 'adminPanel',
                element: (
                    <RequiredAuth>
                        <AdminRoute/>
                    </RequiredAuth>
                )
            },
        ],
        errorElement: <ErrorPage/>
    }
]);

export {router};
