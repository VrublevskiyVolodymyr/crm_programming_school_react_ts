import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {orderReducer} from "./slices/order.slice";
import {authReducer} from "./slices/auth.slice";
import {adminReducer} from "./slices/admin.slice";


const rootReducer = combineReducers({
    orderReducer,
    authReducer,
    adminReducer
});
const setupStore = () => configureStore({
    reducer: rootReducer
})

type RootState = ReturnType<typeof rootReducer>
type AppStore = ReturnType<typeof setupStore>
type AppDispatch = AppStore['dispatch']

export type {
    RootState,
    AppStore,
    AppDispatch
}

export {
    setupStore
}