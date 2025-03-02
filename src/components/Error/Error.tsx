import React, {FC} from 'react';
import ErrorIcon from '@mui/icons-material/Error';

import style from './error.module.css';

interface IProps {
    message: string;
}

type IPropsType = IProps & { children?: React.ReactNode };

const Error: FC<IPropsType> = ({message}) => {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    return (
        <div className={style.errorContainer}>
            <div className={style.errorComponent}>
                <ErrorIcon className={style.errorIcon}/>
                <h2 className={style.errorTitle}>Error</h2>
                <p className={style.errorMessage}>{message}</p>
            </div>
        </div>
    );
};

export {Error};
