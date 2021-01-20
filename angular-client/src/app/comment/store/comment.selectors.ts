import { createSelector } from '@ngrx/store';
import { $_post, $_postSelectedId } from 'src/app/post/store/post.selectors';
import { commentAdapter, $_commentState } from './comment.state';

const MAX_COMMENTS_LIMIT = 5;

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
export const $_comments = createSelector($_commentState, selectAll);
export const $_commentEntities = createSelector($_commentState, selectEntities);
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
    const commentsHasNextPage = comments.length < post.commentsAsParentCount;
    console.log('_commentsByPostIdHasNextPage', commentsHasNextPage);
    console.log(comments.length, post.commentsAsParentCount);
    return commentsHasNextPage;
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
