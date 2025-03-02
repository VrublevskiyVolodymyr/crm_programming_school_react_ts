import {SubmitHandler, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from "../../hooks";
import {ITokenPair} from "../../interfaces";
import {authService} from "../../services";
import {useState} from "react";
import {authActions} from "../../redux";
import css from './login.module.css'

const LoginForm = () => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const dispatch = useAppDispatch();
    const {error} = useAppSelector(state => state.authReducer);
    const {loading} = useAppSelector(state => state.orderReducer);

    const navigate = useNavigate();
    const {handleSubmit, register} = useForm<ITokenPair>({});

    const [showError, setShowError] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const expSession = urlParams.get('expSession');

    const login: SubmitHandler<ITokenPair> = async (user) => {
        try {
            const {meta: {requestStatus}} = await dispatch(authActions.login(user));

            if (requestStatus === 'fulfilled') {
                if (expSession === 'true') {
                    window.history.back();

                    setTimeout(() => {
                        if (window.location.pathname.includes('activate')) {
                            navigate('/orders');
                        }
                    }, 100);
                } else {
                    navigate('/orders');
                }
            }
        } catch (error) {
            authService.deleteTokens();
        }
    };


    const handleInputChange = () => {
        if (showError) {
            setShowError(false);
        }
    };

    function handleButtonSubmit() {
        setShowError(true);
    }

    const errorDetails = error?.details?.[0]?.split(":").slice(1, 2).join(" ").trim();


    return (
        <form onSubmit={handleSubmit(login)} className={css.loginForm}>
            <div className={css.formGroup}>
                <label>Email</label>
                <input className={"form-control"} type="email"
                       placeholder={'email'} {...register('email', {required: true})} onChange={handleInputChange}/>
            </div>
            <div className={css.formGroup}>
                <label>Password</label>
                <input className={"form-control"} type="password"
                       placeholder={'password'} {...register('password', {required: true})}
                       onChange={handleInputChange}/>
            </div>
            {showError && error && <p className={css.error}>{errorDetails}</p>}
            <button className={css.loginButton} onClick={handleButtonSubmit}>{loading ? 'LOADING...' : 'LOGIN'}</button>
        </form>
    );
}

export {LoginForm};