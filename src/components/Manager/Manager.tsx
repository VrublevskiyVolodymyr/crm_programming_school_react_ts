import {FC, useState} from 'react';

import {IUser} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {adminActions} from "../../redux";
import css from './manager.module.css'

interface IProps {
    manager: IUser
}

const Manager: FC<IProps> = ({manager}) => {
    const {id, name, surname, email, is_active, last_login} = manager;

    const {re_token} = useAppSelector(state => state.adminReducer)
    const statistic = useAppSelector((state) => state.adminReducer.statistics[id]);
    const dispatch = useAppDispatch();
    const [isCopied, setIsCopied] = useState(false);
    const [copiedManager, setCopiedManager] = useState<string | null>(null);

    const url = `http://localhost:3000/activate/${re_token?.actionToken}`;

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }

    const handleRecoveryPassword = (id: string) => {
        setCopiedManager(id);
        dispatch(adminActions.getReToken({id}));
    };

    const handleBan = (id: string) => {
        dispatch(adminActions.banManager({id}));
    };

    const handleUnban = (id: string) => {
        dispatch(adminActions.unbanManager({id}));
    };


    const handleCopyToClipboard = (url: string, managerId: string) => {
        navigator.clipboard.writeText(url)
            .then(() => {
                setIsCopied(true);
                setCopiedManager(managerId);
                dispatch(adminActions.setReToken(null));

                setTimeout(() => {
                    setIsCopied(false);
                    setCopiedManager(null);
                }, 1000);
            });
    };


    return (
        <div className={css.container}>
            <div className={css.manager}>
                <div className={css.managerInfo}>
                    <div> id: {manager ? id : null} </div>
                    <div> name: {manager ? name : null} </div>
                    <div> surname: {manager ? surname : null} </div>
                    <div> email: {manager ? email : null} </div>
                    <div> is_active: {is_active ? 'true' : 'false'} </div>
                    <div> lastLogin: {manager.last_login ? formatDate(last_login.toString()) : null} </div>
                </div>

                <div className={css.managerStatistic}>
                    {statistic && (
                        <div className={css.statistic_statuses}>

                            <div className={css.statistic_status}>
                                Total : {statistic.total_count}
                            </div>

                            {statistic.statuses.map((status, index) => {
                                if (status.count !== 0) {
                                    return (
                                        <div className={css.statistic_status} key={index}>
                                            {status.status} : {status.count}
                                        </div>
                                    );
                                }
                                return null;
                            })}


                        </div>
                    )}

                </div>

                <div className={css.managerButtons}>
                    <div>
                        <button onClick={() => re_token ? handleCopyToClipboard(url, id) : handleRecoveryPassword(id)}>
                            {copiedManager === id && re_token ? "COPY TO CLIPBOARD" : is_active ? "RECOVERY PASSWORD" : "ACTIVE"}
                        </button>
                        {copiedManager === id && isCopied && <div>Link copied to clipboard</div>}
                    </div>

                    <button onClick={() => handleBan(id)}>BAN</button>
                    <button onClick={() => handleUnban(id)}>UNBAN</button>
                </div>

            </div>
        </div>
    );
};

export {Manager};