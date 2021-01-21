import { createSelector } from '@ngrx/store';

import { adapter, $_state } from './comment.state';
import { $_post, $_postSelectedId } from 'src/app/post/store/post.selectors';

const { selectAll, selectEntities } = adapter.getSelectors();

export const $_isLoading = createSelector(
  $_state,
  state => state.isLoading
);
export const $_isLoaded = createSelector(
  $_state,
  state => state.isLoaded
);
export const $_error = createSelector(
  $_state,
  state => state.error
);
export const $_selectedId = createSelector(
  $_state,
  state => state.selectedId
);
export const $comments = createSelector($_state, selectAll);
export const $commentsEntities = createSelector($_state, selectEntities);

export const $commentsAsParents = createSelector(
  $comments,
  (comments) => comments.filter(comment => !comment.repliedTo),
)

export const $commentsAsReplies = createSelector(
  $comments,
  (comments) => comments.filter(comment => !!comment.repliedTo),
)

export const $commentsAsParentsByPostId = createSelector(
  $comments,
  $_postSelectedId,
  (comments, postId) =>  {
    if (postId) {
      return comments.filter(comment => (!comment.repliedTo && comment.postId == postId));
    } else {
      return null;
    }
  }
)

export const $commentsAsRepliesByPostId = createSelector(
  $comments,
  $_postSelectedId,
  (comments, postId) =>  {
    if (postId) {
      return comments.filter(comment => (comment.repliedTo && comment.postId == postId));
    } else {
      return null;
    }
  }
)

export const $commentsAsParentsByPostIdHasNextPage = createSelector(
  $commentsAsParentsByPostId,
  $_post,
  (comments, post) => {
    if (comments.length && post.commentsAsParentCount) {
      const commentsHasNextPage = comments.length < post.commentsAsParentCount;
      return commentsHasNextPage;
    }
  }
);

export const $comment = createSelector(
  $_selectedId,
  $commentsEntities,
  (id: string, entities) => id ? entities[id] : undefined
);
