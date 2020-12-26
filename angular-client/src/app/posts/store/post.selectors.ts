import { createSelector } from '@ngrx/store';
import { postAdapter, selectPostState } from './post.state';
import { PostState } from './post.state'

const { selectAll, selectEntities } = postAdapter.getSelectors();

export const $_postLoading = createSelector(
  selectPostState,
  (state: PostState) => state.loading
);
export const $_postLoaded = createSelector(
  selectPostState,
  (state: PostState) => state.loaded
);
export const $_postError = createSelector(
  selectPostState,
  (state: PostState) => state.error
);
export const $_postSelectedId = createSelector(
  selectPostState,
  (state: PostState) => state.selectedId
);
export const $_postCurrNext = createSelector(
  selectPostState,
  (state: PostState) => state.currNext
);
export const $_posts = createSelector(selectPostState, selectAll);
export const $_postEntities = createSelector(selectPostState, selectEntities);
