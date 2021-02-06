import { createSelector } from '@ngrx/store';

import { adapter, $_state } from './comment.state';
import { $_post, $_postSelectedId } from 'src/app/post/store/post.selectors';

const { selectAll, selectEntities } = adapter.getSelectors();

export const $__commentIsLoading = createSelector(
  $_state,
  state => state.isLoading
);
export const $__commentIsLoaded = createSelector(
  $_state,
  state => state.isLoaded
);
export const $__commentError = createSelector(
  $_state,
  state => state.error
);
export const $__commentSelectedId = createSelector(
  $_state,
  state => state.selectedId
);
export const $__commentSelectedPostId = createSelector(
  $_state,
  state => state.selectedPostId,
);


export const $_comments = createSelector($_state, selectAll);
export const $_commentsEntities = createSelector($_state, selectEntities);

export const $_commentsByPostId = createSelector(
  $_comments,
  $_postSelectedId,
  (comments, postId) => comments.filter(comment => comment.postId === postId)
)

export const $_commentsAsParents = createSelector(
  $_comments,
  (comments) => comments.filter(comment => !comment.repliedTo),
)

export const $_commentsAsParentsByPostId = createSelector(
  $_comments,
  $_postSelectedId,
  (comments, postId) => {
    if (postId) {
      return comments.filter(comment => (!comment.repliedTo && comment.postId == postId));
    } else {
      return null;
    }
  }
)

export const $_commentsAsReplies = createSelector(
  $_comments,
  (comments) => comments.filter(comment => !!comment.repliedTo),
)

export const $_commentsAsRepliesByPostId = createSelector(
  $_comments,
  $_postSelectedId,
  (comments, postId) => {
    if (postId) {
      return comments.filter(comment => (comment.repliedTo && comment.postId == postId));
    } else {
      return null;
    }
  }
)

export const $_commentsAsRepliesByCommentId = createSelector(
  $_comments,
  $__commentSelectedId,
  (comments, parentId) => {
    if (parentId) {
      return comments.filter(comment => comment.repliedTo == parentId);
    } else {
      return null;
    }
  }
)

export const $_commentsCurrentTotal = createSelector(
  $_commentsByPostId,
  (comments) => comments.reduce((curr, b) => curr + b.repliesCount + 1, 0)
)

export const $_commentsByPostIdHasNext = createSelector(
  $_post,
  $_commentsCurrentTotal,
  (post, currentTotal) => currentTotal < post.commentsCount
);

export const $_commentsByPostIdRemaining = createSelector(
  $_post,
  $_commentsCurrentTotal,
  (post, currentTotal) => post.commentsCount - currentTotal
)

export const $_comment = createSelector(
  $__commentSelectedId,
  $_commentsEntities,
  (id: string, entities) => id ? entities[id] : undefined
);
