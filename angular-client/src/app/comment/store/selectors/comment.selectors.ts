import { createSelector } from '@ngrx/store';

import { commentAdapter } from '../states/comment.state';
import { $_FeatureStates } from '../comment-feature.state';
import { $_post, $_postSelectedId } from 'src/app/post/store/post.selectors';

const { selectAll, selectEntities } = commentAdapter.getSelectors();

export const $_CommentState = createSelector(
  $_FeatureStates,
  state => state.comments
)

export const $_commentLoading = createSelector(
  $_CommentState,
  state => state.loading
);
export const $_commentLoaded = createSelector(
  $_CommentState,
  state => state.loaded
);
export const $_commentUpdating = createSelector(
  $_CommentState,
  state => state.updating
);
export const $_commentError = createSelector(
  $_CommentState,
  state => state.error
);
export const $_commentSelectedId = createSelector(
  $_CommentState,
  state => state.selectedId
);
export const $_comments = createSelector($_CommentState, selectAll);
export const $_commentEntities = createSelector($_CommentState, selectEntities);
export const $_commentsByPostId = createSelector(
  $_comments,
  $_postSelectedId,
  (comments, postId) => {
    console.log('$_commentsByPostId >> ' + postId);
    return postId ? comments.filter(comment => comment.postId == postId) : undefined;
  }
);
export const $_commentsByPostIdHasNextPage = createSelector(
  $_commentsByPostId,
  $_post,
  (comments, post) => {
    if (comments.length && post.commentsAsParentCount) {
      const commentsHasNextPage = comments.length < post.commentsAsParentCount;
      console.log('_commentsByPostIdHasNextPage', commentsHasNextPage);
      console.log(comments.length, post.commentsAsParentCount);
      return commentsHasNextPage;
    }
  }
)
export const $_comment = createSelector(
  $_commentSelectedId,
  $_commentEntities,
  (id: string, entities) => {
    const entity = id ? entities[id] : undefined;
    return entity;
  }
)
