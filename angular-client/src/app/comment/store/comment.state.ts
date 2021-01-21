import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { PostComment } from "../interfaces";

export const featureName = 'postComments';

export const adapter = createEntityAdapter<PostComment>({
  selectId: (comment) => comment._id,
  sortComparer: (x, y) => {
    return x.createdAt.toString().localeCompare(y.createdAt.toString());
  },
});

export interface State extends EntityState<PostComment> {
  isLoading: boolean;
  isLoaded: boolean;
  selectedId?: string;
  selectedPostId?: string;
  error?: Error;
}

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  isLoaded: false,
  selectedId: null,
  selectedPostId: null,
  error: null
})

export const $_state = createFeatureSelector<State>(featureName);
