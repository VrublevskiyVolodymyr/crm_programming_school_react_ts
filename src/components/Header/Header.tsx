import {FC, useEffect} from 'react';
import {FaSignOutAlt, FaFilter, FaUserCog} from 'react-icons/fa';
import {NavLink, useNavigate} from "react-router-dom";

import {useAppDispatch, useAppSelector} from "../../hooks";
import {authService} from "../../services";
import {authActions, orderActions} from "../../redux";
import {Themes} from "../Themes/Themes";
import css from './header.module.css'
import logo from "../../images/crm.jpg";


interface IProps {
}

const Header: FC<IProps> = () => {
    const {me} = useAppSelector(state => state.authReducer);
    const { isFilterVisible} = useAppSelector(state => state.orderReducer);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const query = new URLSearchParams(window.location.search);

    const currentURL = window.location.href;
    const hasAdminPanel = currentURL.includes('adminPanel');
    const handleLogout = () => {
        authService.deleteTokens();
        dispatch(orderActions.setShouldResetFilters(true));
        dispatch(orderActions.setQueryFromFilter(null));
        dispatch(orderActions.setFilterVisible(false));
        dispatch(authActions.logout())
        localStorage.removeItem("user");
        navigate('/login')
    };

    useEffect(() => {
        const accessToken = authService.getAccessToken();

        if (!me && accessToken) {
            dispatch(authActions.me())
        }
    }, [me, dispatch])


    const toggleFilter = () => {
        const newFilterVisible = !isFilterVisible;
        dispatch(orderActions.setFilterVisible(newFilterVisible));
    }

    const handleAdminPanel = () => {
        if (me?.is_superuser === true) {
            navigate('/adminPanel')
        }
    }

    const handleLogo = () => {
        navigate('/orders')
        dispatch(orderActions.setLogo(true));
    }

    return (
        <div className={css.container}>
            {
                me && !query.get('expSession') ?
                    <div className={css.header}>

                        <div className={css.logo} onClick={handleLogo}>
                            <img src={logo} alt="Logo" className={css.logoImage}/>
                        </div>


                        <div className={css.buttons}>
                            <span>{me.name}</span>

                            <Themes/>

                            {!hasAdminPanel &&
                                (<button className={css.adminPanel} onClick={handleAdminPanel}><FaUserCog/></button>)
                            }

                            {!hasAdminPanel &&
                                (<button onClick={toggleFilter} className={css.faFilter}>
                                    <FaFilter/>
                                </button>)
                            }

                            <button className={css.logout} onClick={handleLogout}><FaSignOutAlt/></button>


                        </div>

                    </div>
                    :
                    <div>
                        <NavLink to={'login'}></NavLink>
                    </div>
            }
        </div>
    );
};

export {Header};