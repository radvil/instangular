import { createSelector } from '@ngrx/store';

import { replyAdapter } from '../states/reply.state';
import { $_FeatureStates } from '../comment-feature.state';
import { $_commentSelectedId } from '../../store/selectors/comment.selectors';

const { selectAll, selectEntities } = replyAdapter.getSelectors();

export const $_ReplyState = createSelector(
  $_FeatureStates,
  state => state.replies
)
export const $_replyLoading = createSelector(
  $_ReplyState,
  state => state.loading
);
export const $_replyLoaded = createSelector(
  $_ReplyState,
  state => state.loaded
);
export const $_replyModifying = createSelector(
  $_ReplyState,
  state => state.modifying
);
export const $_replyError = createSelector(
  $_ReplyState,
  state => state.error
);
export const $_replySelectedId = createSelector(
  $_ReplyState,
  state => state.selectedId
);
export const $_replySelectedCommentId = createSelector(
  $_ReplyState,
  state => state.selectedCommentId
);
export const $_replySelectedPostId = createSelector(
  $_ReplyState,
  state => state.selectedPostId
);
export const $_replies = createSelector($_ReplyState, selectAll);
export const $_replyEntities = createSelector($_ReplyState, selectEntities);
export const $_repliesByCommentId = createSelector(
  $_replies,
  $_commentSelectedId,
  (replies, commentId) => {
    return commentId ? replies.filter(reply => reply.repliedTo == commentId) : undefined;
  }
);
export const $_reply = createSelector(
  $_replySelectedId,
  $_replyEntities,
  (id: string, entities) => {
    const entity = id ? entities[id] : undefined;
    return entity;
  }
)
