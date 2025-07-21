import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { rootReducers } from './rootreducers';

export const store = configureStore({
    reducer: rootReducers,
});

export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, Action<string>>;
