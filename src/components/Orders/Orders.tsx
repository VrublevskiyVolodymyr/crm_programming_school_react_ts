import {FC, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import qs from 'qs';

import {Order} from "../Order/Order";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {orderActions} from "../../redux";
import {Pagination} from "../Pagination/Pagination";
import {IOrder} from "../../interfaces";
import {Loader2} from "../Loaders/Loader2/Loader2";
import {FilterComponent} from "../FilterComponent/FilterComponent";
import css from './orders.module.css'

interface IProps {
}

const Orders: FC<IProps> = () => {
        const {
            orders,
            isFilterVisible,
            total_pages,
            loading,
            commentLoading,
            groupLoading,
            updateOrderLoading,
            groups,
            logo,
            excelUrl,
        } = useAppSelector((state) => state.orderReducer);
        const dispatch = useAppDispatch();
        const navigate = useNavigate();

        const savedTheme = localStorage.getItem('app-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const newSearchParams = new URLSearchParams(window.location.search);
        const isQueryExpression = newSearchParams.get('expSession') === 'true';
        const query = new URLSearchParams(window.location.search);
        const currentPage = query.get('page') ? parseInt(query.get('page') as string, 10) : 1;
        const orderBy = query.get('order') || "";
        const filterParams = ['status', 'group', 'course', 'course_format', 'course_type', 'name', 'surname', 'email', 'phone', 'age', 'startDate', 'endDate', 'my'];
        const queryData = qs.parse(window.location.search, {ignoreQueryPrefix: true});
        const isFilterQuery = filterParams.some(param => queryData[param]);

        const [pageChanged, setPageChanged] = useState(false);

        const currentPageRef = useRef(currentPage);
        currentPageRef.current = currentPage;


        useEffect(() => {
            if (isFilterQuery) {
                dispatch(orderActions.setFilterVisible(true))
            }
        }, [isFilterQuery, dispatch]);

    const memoizedQueryData = useMemo(() => queryData, [JSON.stringify(queryData)]);

    useEffect(() => {
        if (!loading && (orders.length < 1 || pageChanged)) {
            dispatch(orderActions.getAll(memoizedQueryData));
            setPageChanged(false);
        }
        if (logo) {
            dispatch(orderActions.getAll({page: 1, order: '-id'}));
            dispatch(orderActions.setLogo(false));
        }
    }, [orders.length, pageChanged, logo, dispatch, memoizedQueryData]);


    const handlePageChange = (selectedPage: number) => {
            if ((selectedPage === currentPageRef.current) || orders.length === 0) return;
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('page', selectedPage.toString());

            filterParams.forEach(param => {
                const value = newSearchParams.get(param);
                if (value) {
                    urlParams.set(param, value);
                }
            });

            const updatedQuery = urlParams.toString();
            window.history.pushState({}, '', `/orders?${updatedQuery}`);
            setPageChanged(true);
        };

        const handleFilterChange = (queryParams: string) => {
            const currentQueryParams = qs.parse(window.location.search, {ignoreQueryPrefix: true});
            currentQueryParams.page = '1';
            const updatedQueryParams = qs.stringify(currentQueryParams, {encode: false});

            if (updatedQueryParams !== window.location.search) {
                window.history.pushState({}, '', `/orders?${updatedQueryParams}`);
                setPageChanged(true);
            }
        };


        const handleEditOrder = (orderId: number, editedOrderData: IOrder) => {
            dispatch(orderActions.update({id: orderId, order: editedOrderData}));
        };

        useEffect(() => {
            if (isQueryExpression) {
                navigate('/login?expSession=true', {replace: true});
            }
        }, [isQueryExpression, navigate]);

        useEffect(() => {
            if (!loading && groups.length === 0) {
                dispatch(orderActions.getGroups());
            }
        }, [dispatch]);


        const handleResetChange = () => {
            dispatch(orderActions.getAll({page: 1, order: '-id'}));
            window.history.pushState({}, '', `/orders?page=1&order=-id`);
            dispatch(orderActions.setQueryFromFilter(null));
        };

        function handleFilterExcel(queryParams: string) {
            const queryData = qs.parse(queryParams, {ignoreQueryPrefix: true});
            const status = queryData.status as string;
            const group = queryData.group as string;
            const course = queryData.course as string;
            const course_format = queryData.course_format as string;
            const course_type = queryData.course_type as string;
            const name = queryData.name as string;
            const surname = queryData.surname as string;
            const email = queryData.email as string;
            const phone = queryData.phone as string;
            const age = queryData.age as string;
            const startDate = queryData.startDate as string;
            const endDate = queryData.endDate as string;
            const my = queryData.my as string;

            const params: Record<string, string | undefined> = {
                status, group, course, course_format, course_type, name, surname, email,
                phone, age, startDate, endDate, my,
            };

            if (orderBy) {
                params.order = orderBy;
            }
            dispatch(orderActions.exportToExcel(params));
        }

        const downloadExcelFile = (url: string) => {
            try {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Orders.xlsx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
            }
        };

        useEffect(() => {
            if (!excelUrl) return;
            downloadExcelFile(excelUrl);
        }, [excelUrl]);


    return (
            <div className={css.container}>
                {isFilterVisible && <FilterComponent onFilter={handleFilterChange} onReset={handleResetChange}
                                                     onFilterExcel={handleFilterExcel}/>}
                {!loading && !commentLoading && !groupLoading && !updateOrderLoading && <Order orders={orders} onEditOrder={handleEditOrder}/>}
                {loading && <Loader2/>}
                {(total_pages !== null && total_pages > 1) && <Pagination
                    pageCount={total_pages || 1}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    isFirstPage={currentPage === 1}
                    isLastPage={currentPage === total_pages}
                />}

            </div>
        );
    }
;

export {Orders};
