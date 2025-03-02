import {FC} from 'react';
import {SubmitHandler, useForm} from "react-hook-form"
import 'bootstrap/dist/css/bootstrap.min.css';

import {useAppDispatch, useAppSelector} from "../../hooks";
import {orderActions} from "../../redux";
import {IManager} from "../../interfaces";
import css from "./comment.module.css";


interface IProps {
    orderId: number;
    managerId: string;
    manager: IManager | null;
}

const CommentForm: FC<IProps> = ({orderId, managerId, manager}) => {
    const dispatch = useAppDispatch();
    const {me} = useAppSelector(state => state.authReducer)

    const {handleSubmit, register, reset, formState: {errors, isValid}} = useForm<{ comment: string }>({
        mode: 'onSubmit',
    });

    const createComment: SubmitHandler<{ comment: string }> = async (data) => {
        await dispatch(orderActions.createComment({
            comment: data.comment, orderId
        }) as any);
        reset()
    };

    return (
        <form onSubmit={handleSubmit(createComment)} className={css.commentForm}>
            <div className={css.formGroup}>
                <input className={"form-control"} type="text"
                       placeholder="comment" {...register("comment", {required: true})} />
                {errors.comment && <span>This field is required</span>}
            </div>
            <button disabled={!isValid || !(me && me.id && (manager === null || me.id === managerId))} type="submit"
                    className={css.submitButton}>SUBMIT
            </button>
        </form>
    );
};

export {CommentForm};
