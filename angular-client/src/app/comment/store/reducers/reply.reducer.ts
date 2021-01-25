import { createReducer, on } from '@ngrx/store';
import { initialReplyState, replyAdapter } from '../states/reply.state';
import * as replyActions from '../actions/reply.actions';

export const replyReducer = createReducer(
  initialReplyState,

  on(replyActions.GetRepliesByCommentId, (state, { dto }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedCommentId: dto.commentId,
  })),
  on(replyActions.GetRepliesByCommentIdFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(replyActions.GetRepliesByCommentIdSuccess, (state, { replies }) => {
    const selectedPostId = replies[0].postId;
    const selectedCommentId = replies[0].repliedTo;

    return replyAdapter.addMany(replies, {
      ...state,
      loaded: true,
      loading: false,
      selectedPostId,
      selectedCommentId,
    })
  }),

  on(replyActions.PushManyReplies, (state, { replies }) => {
    const selectedPostId = replies[0].postId;
    const selectedCommentId = replies[0].repliedTo;

    return replyAdapter.upsertMany(replies, {
      ...state,
      loaded: true,
      loading: false,
      selectedPostId,
      selectedCommentId,
    })
  }),
)
