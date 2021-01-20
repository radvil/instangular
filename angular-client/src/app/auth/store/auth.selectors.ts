import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../interfaces";

export const $_authState = createFeatureSelector<AuthState>('auth');
export const $_isLoading = createSelector($_authState, state => state.isLoading);
export const $_isLoaded = createSelector($_authState, state => state.isLoaded);
export const $_error = createSelector($_authState, state => state.error);
export const $_authUser = createSelector($_authState, state => state.user);
