import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.model";

export const $_authState = createFeatureSelector<AuthState>('auth');
export const $_isLoading = createSelector($_authState,state => state.isLoading);
export const $_isAuth = createSelector($_authState, state => state.isAuth);
export const $_error = createSelector($_authState, state => state.error);
export const $_authUser = createSelector($_authState, state => state.user);
