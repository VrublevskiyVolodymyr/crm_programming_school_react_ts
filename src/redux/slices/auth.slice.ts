import {createAsyncThunk, createSlice, isFulfilled, isRejectedWithValue} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';

import {ITokenPair, IUser, IErrorAuth} from '../../interfaces';
import {authService} from '../../services';


interface IState {
    error: IErrorAuth | null;
    me: IUser | null;
    activate: string | null;
}

const initialState: IState = {
    error: null,
    me: null,
    activate: null,
}

const login = createAsyncThunk<IUser, ITokenPair>(
    'authSlice/login',
    async (user, {rejectWithValue}) => {
        try {
            return await authService.login(user);
        } catch (e) {
            const error = e as AxiosError
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue({message: 'An error occurred'});
            }
        }
    }
)

const me = createAsyncThunk<IUser, void>(
    'authSlice/me',
    async () => {
        const {data} = await authService.me();
        return data
    }
)

const activateManager = createAsyncThunk<string, { token: string, password: string }>(
    'authSlice/activateManager',
    async ({token, password}, {rejectWithValue}) => {
        try {
            const {data} = await authService.activate(token, password)
            return data
        } catch (e) {
            const err = e as AxiosError
            return rejectWithValue(err.response?.data)
        }
    }
)

const slice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        logout: (state) => {
            state.me = null;
            state.error = null;
        },
    },
    extraReducers: builder =>
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.me = action.payload
            })
            .addCase(me.fulfilled, (state, action) => {
                state.me = action.payload
            })
            .addCase(activateManager.fulfilled, (state, action) => {
                state.activate = action.payload
            })
            .addMatcher(isFulfilled(), state => {
                state.error = null
            })
            .addMatcher(isRejectedWithValue(login, me), (state, action) => {
                    state.error = action.payload as IErrorAuth;
            })


});

const {actions, reducer: authReducer} = slice;

const authActions = {
    ...actions,
    login,
    me,
    activateManager
}

export {
    authReducer,
    authActions,
}