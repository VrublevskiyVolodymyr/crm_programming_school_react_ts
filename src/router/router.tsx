import {createBrowserRouter, Navigate, useNavigate} from "react-router-dom";

import {MainLayout} from "../layouts";
import {ActivatePage, AdminPanelPage, ErrorPage, LoginPage, OrderPage} from "../pages";
import {RequiredAuth} from "../hoс";
import {useAppSelector} from "../hooks";
import {IUser} from "../interfaces";
import {useEffect} from "react";

const AdminRoute = () => {
    const navigate = useNavigate();
    const newSearchParams = new URLSearchParams(window.location.search);
    const isQueryExpression = newSearchParams.get('expSession') === 'true';
    const {me} = useAppSelector(state => state.authReducer);
    const storedUser = localStorage.getItem("user");


    useEffect(() => {
        if (isQueryExpression) {
            navigate('/login?expSession=true', {replace: true});
        }
    }, [isQueryExpression, navigate]);

    let user: IUser | null = null;
    if (typeof storedUser === "string") {
        user = JSON.parse(storedUser) as IUser;
    }

    if (me?.is_superuser || user?.is_superuser) {
        return <AdminPanelPage />;
    } else {
        return <Navigate to="/orders" />;
    }
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
