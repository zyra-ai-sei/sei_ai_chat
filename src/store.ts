import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { rootReducers } from './redux/rootreducers';
import socketMiddleware from './redux/socket/middleware'

export const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, Action<string>>;