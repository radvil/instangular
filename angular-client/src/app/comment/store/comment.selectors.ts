import { createSelector } from '@ngrx/store';
import { commentAdapter, $_commentState } from './comment.state';

const { selectAll, selectEntities } = commentAdapter.getSelectors();

export const $_commentLoading = createSelector(
  $_commentState,
  state => state.loading
);
export const $_commentLoaded = createSelector(
  $_commentState,
  state => state.loaded
);
export const $_commentError = createSelector(
  $_commentState,
  state => state.error
);
export const $_commentSelectedId = createSelector(
  $_commentState,
  state => state.selectedId
);
export const $_commentSelectedPostId = createSelector(
  $_commentState,
  state => state.selectedPostId,
);
export const $_commentCurrNext = createSelector(
  $_commentState,
  state => state.currNext
);
export const $_comments = createSelector($_commentState, selectAll);
export const $_commentEntities = createSelector($_commentState, selectEntities);
export const $_commentsOfPost = createSelector(
  $_comments,
  $_commentSelectedPostId,
  (comments, postId) => {
    return postId ? comments.filter(comment => comment.postId == postId) : undefined;
  }
);
