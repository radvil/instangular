import { createSelector } from '@ngrx/store';
import { userAdapter, $_userState } from './user.state';

const { selectAll, selectEntities } = userAdapter.getSelectors();

export const $_userLoading = createSelector($_userState, state => state.isLoading);
export const $_userLoaded = createSelector($_userState, state => state.isLoaded);
export const $_userError = createSelector($_userState, state => state.error);
export const $_userSelectedUsername = createSelector($_userState, state => state.selectedUsername);
export const $_users = createSelector($_userState, selectAll);
export const $_userEntities = createSelector($_userState, selectEntities);
export const $_user = createSelector(
  $_userSelectedUsername,
  $_userEntities,
  (username: string, entities) => username ? entities[username] : undefined
)
