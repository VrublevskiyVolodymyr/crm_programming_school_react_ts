import React, {FC, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {IOrder} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {orderActions} from "../../redux";
import {EditModal} from "../EditModal/EditModal";
import {CommentModal} from "../CommentModal/CommentModal";
import {CommentForm} from "../CommentForm/CommentForm";
import css from './order.module.css';
import qs from "qs";

interface IProps {
    orders: IOrder[];
    onEditOrder: (id: number, editedOrder: IOrder) => void;

}

const Order: FC<IProps> = ({orders, onEditOrder}) => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const {sortedColumn, sortDirection} = useAppSelector((state) => state.orderReducer);
    const {me} = useAppSelector(state => state.authReducer)
    const navigate = useNavigate();
    const newSearchParams = new URLSearchParams(window.location.search);
    const dispatch = useAppDispatch();
    const isQueryExpression = newSearchParams.get('expSession') === 'true';

    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;
    const [openCommentModalIndex, setOpenCommentModalIndex] = useState<{ [key: number]: number }>({});
    const [openEditModalIndex, setOpenEditModalIndex] = useState<{ [key: number]: number }>({});
    const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);

    const openCommentModal = (rowIndex: number) => {
        setOpenCommentModalIndex({...openCommentModalIndex, [rowIndex]: rowIndex});
    };

    const closeCommentModal = () => {
        setOpenCommentModalIndex({});
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const onHeaderClick = (columnKey: string) => {
        const newSortDirection =
            sortedColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
        const sortOrder = newSortDirection === "asc" ? "" : "-";
        const order = `${sortOrder}${columnKey}`;
        const queryData = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        if (queryData.order === order) {
            queryData.order = order.startsWith("-") ? columnKey : `-${columnKey}`;
        } else {
            queryData.order = order;
        }

        if (!queryData.page) {
            queryData.page = '1';
        }
        const queryString = qs.stringify(queryData, { encode: false });
        window.history.pushState({}, '', `?${queryString}`);

        dispatch(orderActions.setSortedColumn({ columnKey, newSortDirection }));
        dispatch(orderActions.getAll(queryData));
    };

    useEffect(() => {
        if (isQueryExpression) {
            navigate('/login?expSession=true', {replace: true});
        }
    }, [isQueryExpression, navigate]);

    const toggleRow = (rowId: number) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((id) => id !== rowId));
        } else {
            setExpandedRows([...expandedRows, rowId]);
        }
    };

    const openEditModal = (order: IOrder | null, rowIndex: number) => {
        setEditingOrder(order);
        setOpenEditModalIndex({...openEditModalIndex, [rowIndex]: rowIndex});
    };

    const closeEditModal = () => {
        setOpenEditModalIndex({});
        dispatch(orderActions.setIsUpdate(false))
    };

    const formatDate = (dateString: string) => {
        if (dateString) {
            const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long', day: 'numeric'};
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', options);
        }
        return null;
    }

    return (
        <div className={css.tableContainer}>
            <table className={css.table}>
                <thead>
                <tr className={css.tr}>
                    <th className={css.th} onClick={() => onHeaderClick('id')}>id</th>
                    <th onClick={() => onHeaderClick('name')}>name</th>
                    <th onClick={() => onHeaderClick('surname')}>surname</th>
                    <th onClick={() => onHeaderClick('email')}>email</th>
                    <th onClick={() => onHeaderClick('phone')}>phone</th>
                    <th onClick={() => onHeaderClick('age')}>age</th>
                    <th onClick={() => onHeaderClick('course')}>course</th>
                    <th onClick={() => onHeaderClick('course_format')}>course_format</th>
                    <th onClick={() => onHeaderClick('course_type')}>course_type</th>
                    <th onClick={() => onHeaderClick('status')}>status</th>
                    <th onClick={() => onHeaderClick('sum')}>sum</th>
                    <th onClick={() => onHeaderClick('alreadyPaid')}>alreadyPaid</th>
                    <th onClick={() => onHeaderClick('group')}>group</th>
                    <th onClick={() => onHeaderClick('created_at')}>created_at</th>
                    <th onClick={() => onHeaderClick('manager')}>manager</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <React.Fragment key={order.id}>
                        <tr onClick={() => toggleRow(order.id)}>
                            <td>{order.id || 'null'}</td>
                            <td>{order.name || 'null'}</td>
                            <td>{order.surname || 'null'}</td>
                            <td>{order.email || 'null'}</td>
                            <td>{order.phone || 'null'}</td>
                            <td>{order.age || 'null'}</td>
                            <td>{order.course || 'null'}</td>
                            <td>{order.course_format || 'null'}</td>
                            <td>{order.course_type || 'null'}</td>
                            <td>{order.status || 'null'}</td>
                            <td>{order.sum || 'null'}</td>
                            <td>{order.alreadyPaid || 'null'}</td>
                            <td>{order.group ? (order.group.name || 'null') : 'null'}</td>
                            <td>{formatDate(order.created_at) || 'null'}</td>
                            <td>{order.manager ? (order.manager.name || 'null') : 'null'}</td>
                        </tr>
                        {expandedRows.includes(order.id) && (
                            <tr>
                                <td colSpan={14} className={css.expandedRow}>
                                    <div className={css.expandedRows}>
                                        <div>
                                            {order.utm && <p>UTM : {order.utm}</p>}
                                            {order.msg && <p>Message: {order.msg}</p>}
                                        </div>
                                        <div key={order.id} className={css.container}>
                                            {order.comments.length > 0 && <div className={css.comments}
                                                                               onClick={() => openCommentModal(order.id)}>
                                                {order.comments.slice(0, 3).map((comment, index) => (
                                                    <div key={index}>

                                                        <div className={css.comment}>
                                                            <div className={css.commentText}>{comment.comment}</div>
                                                            <div className={css.commentDetails}>
                                                                <span>{comment.manager.name}</span>
                                                                <span>  {comment.manager.surname}</span>
                                                                <span>{formatDate(comment.created_at)}</span>
                                                            </div>
                                                        </div>

                                                        <hr className={css.horizontalLine}/>

                                                    </div>
                                                ))}
                                            </div>}

                                            <div className={css.commentForm}>
                                                <CommentForm orderId={order.id} managerId={order.manager?.id ?? "0"}
                                                             manager={order.manager}
                                                />
                                            </div>

                                            <button
                                                disabled={!(me && me.id && (order.manager === null || me.id === order.manager.id))}
                                                onClick={() => openEditModal(order, order.id)}>Edit
                                            </button>

                                            {openEditModalIndex[order.id] !== undefined && (
                                                <EditModal
                                                    onClose={closeEditModal}
                                                    onEditOrder={onEditOrder}
                                                    order={editingOrder as IOrder}
                                                />
                                            )}

                                            {openCommentModalIndex[order.id] !== undefined &&(
                                                <CommentModal
                                                    comments={order.comments}
                                                    currentPage={currentPage}
                                                    commentsPerPage={commentsPerPage}
                                                    total_pages={Math.ceil(order.comments.length / commentsPerPage)}
                                                    onPageChange={handlePageChange}
                                                    onClose={closeCommentModal}
                                                />
                                            )}
                                        </div>

                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export {Order};