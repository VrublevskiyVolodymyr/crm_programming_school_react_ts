import {createAsyncThunk, createSlice, isFulfilled, isRejectedWithValue} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IComment, IErrorAuth, IGroup, IOrder, IOrderPainted} from "../../interfaces";
import {orderService} from "../../services";

interface IState {
    orders: IOrder[],
    prev: string | null,
    next: string | null,
    total_pages: number | null,
    sortDirection: string,
    sortedColumn: string,
    groups: IGroup[],
    loading: boolean,
    commentLoading: boolean,
    updateOrderLoading: boolean,
    groupLoading: boolean,
    isFilterVisible: boolean,
    queryFromFilter: string | null,
    orderBy: string | null,
    shouldResetFilters: boolean,
    excelUrl: string | null;
    error: IErrorAuth | null;
    isUpdate: boolean;
    logo: boolean;
}

const initialState: IState = {
    orders: [],
    prev: null,
    next: null,
    total_pages: null,
    sortDirection: "asc",
    sortedColumn: "",
    groups: [],
    loading: false,
    commentLoading: false,
    updateOrderLoading: false,
    groupLoading: false,
    isFilterVisible: false,
    queryFromFilter: null,
    orderBy: null,
    shouldResetFilters: false,
    excelUrl: null,
    error: null,
    isUpdate: false,
    logo: false,
};


const getAll = createAsyncThunk<IOrderPainted, {
    page?: number,
    order?: string,
    name?: string,
    surname?: string,
    email?: string,
    phone?: string,
    age?: string,
    course?: string,
    course_format?: string,
    course_type?: string,
    status?: string,
    group?: string,
    startDate?: string,
    endDate?: string,
    my?: string,
}>(
    'orderSlice/getAll',
    async ({
               page,
               order,
               name,
               surname,
               email,
               phone,
               age,
               course,
               course_format,
               course_type,
               group,
               startDate,
               endDate,
               my,
               status
           }, {rejectWithValue}) => {
        try {
            const {data} = await orderService.getAll(page, order, name, surname, email, phone, age, course, course_format, course_type, status, group, startDate, endDate, my);
            return data
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data)
        }
    }
);

const exportToExcel = createAsyncThunk<string, {
    page?: number,
    order?: string,
    name?: string,
    surname?: string,
    email?: string,
    phone?: string,
    age?: string,
    course?: string,
    course_format?: string,
    course_type?: string,
    status?: string,
    group?: string,
    startDate?: string,
    endDate?: string,
    my?: string
}>(
    'orderSlice/exportToExcel',
    async (args, {rejectWithValue}) => {
        try {
            const data = await orderService.exportToExcel(args);

            if (!data) {
                throw new Error('No data received');
            }

            const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = window.URL.createObjectURL(blob);

            return url;
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data)
        }
    }
);

const update = createAsyncThunk<IOrder, { order: IOrder, id: number }>(
    'orderSlice/update',
    async ({id, order}, {rejectWithValue}) => {
        try {
            const {data} = await orderService.updateById(id, order)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const createComment = createAsyncThunk<IComment, { comment: string, orderId: number }>(
    'orderSlice/createComment',
    async ({comment, orderId}, {rejectWithValue}) => {
        try {
            const {data} = await orderService.createComment(comment, orderId)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const getGroups = createAsyncThunk<IGroup[]>(
    'orderSlice/getGroups',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await orderService.getGroups();
            return data
        } catch (e) {
            const err = e as AxiosError;
            return rejectWithValue(err.response?.data)
        }
    }
);

const createGroup = createAsyncThunk<IGroup, { name: string }>(
    'orderSlice/createGroup',
    async ({name}, {rejectWithValue}) => {
        try {
            const {data} = await orderService.createGroup(name);
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const orderSlice = createSlice({
    name: "carSlice",
    initialState,
    reducers: {
        setSortedColumn: (state, action) => {
            state.sortedColumn = action.payload.columnKey;
            state.sortDirection = action.payload.newSortDirection;
        },
        setFilterVisible: (state, action) => {
            state.isFilterVisible = action.payload;
        },
        setQueryFromFilter: (state, action) => {
            state.queryFromFilter = action.payload;
        },
        setOrderBy: (state, action) => {
            state.orderBy = action.payload;
        },
        setShouldResetFilters: (state, action) => {
            state.shouldResetFilters = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setIsUpdate: (state, action) => {
            state.isUpdate = action.payload;
        },
        setLogo: (state, action) => {
            state.logo = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getAll.fulfilled, (state, action) => {
                const {items, prev, next, total_pages} = action.payload;
                state.orders = items;
                state.next = next;
                state.prev = prev;
                state.total_pages = total_pages;
                state.loading = false
            })

            .addCase(exportToExcel.fulfilled, (state, action) => {
                state.excelUrl = action.payload;
                state.loading = false;
            })
            .addCase(createComment.pending, (state) => {
                state.commentLoading = false;
            }).addCase(createGroup.pending, (state) => {
            state.groupLoading = false;
        })
            .addCase(update.pending, (state) => {
                state.updateOrderLoading = false;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                const {order_id, manager} = action.payload;
                state.loading = false
                state.commentLoading = false
                state.orders = state.orders.map((order) => {
                    if (order.id === order_id) {
                        const updatedOrder = {...order, comments: [action.payload, ...order.comments]};

                        if (updatedOrder.status === null || updatedOrder.status === 'New') {
                            updatedOrder.status = 'In work';
                        }
                        if (manager) {
                            updatedOrder.manager = manager
                        }
                        return updatedOrder;
                    } else {
                        return order;
                    }
                });
            })
            .addCase(update.fulfilled, (state, action) => {
                const {id, ...updatedOrder} = action.payload;
                state.loading = false
                state.updateOrderLoading = false
                state.isUpdate = true
                state.orders = state.orders.map((order) => {
                    if (order.id === id) {
                        const updated = {...order, ...updatedOrder};

                        return updated;
                    }
                    return order;
                });
            })
            .addCase(getGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.loading = false
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false
                state.groupLoading = false
                state.groups = [...state.groups, action.payload];
                state.loading = false
            })
            .addMatcher(isFulfilled(), state => {
                state.error = null
                state.loading = false
            })
            .addMatcher(isRejectedWithValue(update, createGroup), (state, action) => {
                const payload = action.payload as { details?: string[] };
                const details = payload.details;

                const hasFieldError = Array.isArray(details) && details.some((detail) => detail.includes("Field"));

                state.error = hasFieldError ? (action.payload as IErrorAuth) : null;
                state.loading = false;
                state.commentLoading = false;
            })

            .addDefaultCase((state, actions) => {
                const [actionStatus] = actions.type.split('/').slice(-1);
                state.loading = actionStatus === 'pending';
            })
});


const {
    reducer: orderReducer,
    actions: {
        setSortedColumn,
        setFilterVisible,
        setQueryFromFilter,
        setOrderBy,
        setShouldResetFilters,
        setError,
        setIsUpdate,
        setLogo,
    }
} = orderSlice;

const orderActions = {
    getAll,
    exportToExcel,
    createComment,
    update,
    getGroups,
    createGroup,
    setFilterVisible,
    setSortedColumn,
    setQueryFromFilter,
    setOrderBy,
    setShouldResetFilters,
    setError,
    setIsUpdate,
    setLogo,
}

export {orderReducer, orderActions}
