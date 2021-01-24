import { ActionReducerMap, MetaReducer } from "@ngrx/store";

import { AuthState } from "../../auth/interfaces";
import { authReducer } from "../../auth/store/auth.reducer";
import { initStateFromLocalStorage } from "./app.reducer";

export interface AppState {
	readonly auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
	auth: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
	initStateFromLocalStorage
];
