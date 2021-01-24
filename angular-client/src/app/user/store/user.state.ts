import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { User } from "../interfaces";

const selectId = (user: User): string => user.username;
const sortComparer = (userX: User, userY: User): number => {
  return userX.createdAt?.toString().localeCompare(userY.createdAt?.toString())
}

export const userAdapter = createEntityAdapter<User>({ selectId, sortComparer });

export interface UserState extends EntityState<User> {
  loaded: boolean;
  loading: boolean;
  error?: Error;
  selectedUsername?: string;
}

export const $_userState = createFeatureSelector<UserState>('users');

export const initialUserState: UserState = userAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
  selectedUsername: null,
})