import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IActionToken, IManager, IManagerPainted, IStatistic, IUser} from "../../interfaces";
import {adminService} from "../../services";


interface IState {
    managers: IUser[],
    loading: boolean,
    prev: string | null,
    next: string | null,
    total_pages: number | null,
    re_token: IActionToken | null,
    statisticAll: IStatistic | null,
    statistics: Record<string, IStatistic>;
    isVisibleManagerModal: boolean;
}

const initialState: IState = {
    managers: [],
    loading: true,
    prev: null,
    next: null,
    total_pages: null,
    re_token: null,
    statisticAll: null,
    statistics: {},
    isVisibleManagerModal: false
};


const getAllManagers = createAsyncThunk<IManagerPainted, { page: number, limit: number }>(
    'adminSlice/getAllManagers',
    async ({page, limit}, {rejectWithValue}) => {
        try {
            const {data} = await adminService.getAllManagers(page, limit)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const createManager = createAsyncThunk<IUser, IManager>(
    'adminSlice/createManager',
    async (manager, {rejectWithValue}) => {
        try {
            const {data} = await adminService.createManager(manager)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const getReToken = createAsyncThunk<IActionToken, { id: string }>(
    'adminSlice/getReToken',
    async ({id}, {rejectWithValue}) => {
        try {
            const {data} = await adminService.reToken(id)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const banManager = createAsyncThunk<IUser, { id: string }>(
    'adminSlice/banManager',
    async ({id}, {rejectWithValue}) => {
        try {
            const {data} = await adminService.banManager(id)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const unbanManager = createAsyncThunk<IUser, { id: string }>(
    'adminSlice/unbanManager',
    async ({id}, {rejectWithValue}) => {
        try {
            const {data} = await adminService.unbanManager(id)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const getAllStatistic = createAsyncThunk<IStatistic, {}>(
    'adminSlice/getAllStatistic',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await adminService.statisticAll()
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const getStatisticByManagerId = createAsyncThunk<
    { managerId: string; statisticData: IStatistic }, { id: string }>(
    'adminSlice/geStatisticByManagerId',
    async ({id}, {rejectWithValue}) => {
        try {
            const {data} = await adminService.statisticByManagerId(id);
            const statisticData: IStatistic = data;
            return {managerId: id, statisticData};
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const adminSlice = createSlice({
    name: "adminSlice",
    initialState,
    reducers: {
        setIsVisibleManagerModal: (state, action) => {
            state.isVisibleManagerModal = action.payload;
        },
        setReToken: (state, action) => {
            state.re_token = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(getAllManagers.fulfilled, (state, action) => {
                const {data, prev, next, total_pages} = action.payload;
                state.managers = data;
                state.next = next;
                state.prev = prev;
                state.total_pages = total_pages;
                state.loading = false;
            })

            .addCase(getReToken.fulfilled, (state, action) => {
                state.re_token = action.payload;
                state.loading = false;
            })

            .addCase(createManager.fulfilled, (state, action) => {
                state.managers = [action.payload, ...state.managers];
                state.loading = false;
            })

            .addCase(banManager.fulfilled, (state, action) => {
                const {id, ...banManagerData} = action.payload;
                state.loading = false;
                state.managers = state.managers.map(manager => {
                    if (manager.id === id) {
                        return {...manager, ...banManagerData};
                    }
                    return manager;
                });
            })

            .addCase(unbanManager.fulfilled, (state, action) => {
                const {id, ...unbanManagerData} = action.payload;
                state.loading = false;
                state.managers = state.managers.map(manager => {
                    if (manager.id === id) {
                        return {...manager, ...unbanManagerData};
                    }
                    return manager;
                });
            })


            .addCase(getAllStatistic.fulfilled, (state, action) => {
                state.statisticAll = action.payload;
                state.loading = false;
            })
            .addCase(getStatisticByManagerId.fulfilled, (state, action) => {
                const {managerId, statisticData} = action.payload;
                state.statistics[managerId] = statisticData;
                state.loading = false;
            })

            .addDefaultCase((state, actions) => {
                const [actionStatus] = actions.type.split('/').slice(-1);
                state.loading = actionStatus === 'pending';
            })

});


const {
    reducer: adminReducer,
    actions: {setIsVisibleManagerModal, setReToken}
} = adminSlice;

const adminActions = {
    getAllManagers,
    getReToken,
    createManager,
    banManager,
    unbanManager,
    getAllStatistic,
    getStatisticByManagerId,
    setIsVisibleManagerModal,
    setReToken
}

export {adminReducer, adminActions}
