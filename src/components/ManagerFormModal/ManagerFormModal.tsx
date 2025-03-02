import {FC, useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi";

import {managerValidator} from '../../validators';
import {useAppDispatch} from "../../hooks";
import {IManager} from "../../interfaces";
import {adminActions} from "../../redux";
import css from "./managerFormModal.module.css";


interface IProps {

}

const ManagerFormModal: FC<IProps> = () => {
    const dispatch = useAppDispatch();
    const [showError, setShowError] = useState(false);

    const {handleSubmit, register, formState: {errors}} = useForm<IManager>(
        {
            mode: 'onSubmit',
            resolver: joiResolver(managerValidator)
        });

    const create: SubmitHandler<IManager> = (manager) => {
        dispatch(adminActions.createManager(manager));
        dispatch(adminActions.setIsVisibleManagerModal(false));
    }

    const handleClose = () => {
        dispatch(adminActions.setIsVisibleManagerModal(false));
    };

    const handleInputChange = () => {
        if (showError) {
            setShowError(false);
        }
    };

    function handleButtonSubmit() {
        setShowError(true);
    }

    return (
        <div className={css.modalBackground}>
            <div className={css.managerForm}>
                <form onSubmit={handleSubmit(create)} className={css.form}>
                    <div className={css.formGroup}>
                        <label>Name</label>
                        <input className={css.form_control} type="text"
                               placeholder={'Name'} {...register('name', {required: true})}
                               onChange={handleInputChange}/>
                    </div>

                    <div className={css.formGroup}>
                        <label>Surname</label>
                        <input className={css.form_control} type="text"
                               placeholder={'Surname'} {...register('surname', {required: true})}
                               onChange={handleInputChange}/>
                    </div>

                    <div className={css.formGroup}>
                        <label>Email</label>
                        <input className={css.form_control} type="text"
                               placeholder={'Email'} {...register('email', {required: true})}
                               onChange={handleInputChange}/>
                    </div>

                    <div className={css.buttonContainer}>
                        <button className={css.button} onClick={handleButtonSubmit}>CREATE</button>
                        <button className={css.button} onClick={handleClose}>CANCEL</button>
                    </div>
                    {showError && Object.keys(errors).length > 0 && <div>{Object.values(errors)[0].message}</div>}
                </form>
            </div>
        </div>
    );
};

export {ManagerFormModal};