import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';
import { sortByDate } from 'src/app/_shared/utils';
import { PostComment } from "../interfaces";

export const featureName = 'postComments';

export const adapter = createEntityAdapter<PostComment>({
  selectId: (comment: PostComment): string => comment._id,
  sortComparer: sortByDate,
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
