import { createReducer, on } from '@ngrx/store';
import { initialState, adapter } from './comment.state';
import * as CommentActions from './comment.actions';

export const commentReducer = createReducer(
  initialState,

  on(CommentActions.GetCommentsByPostId, (state, { dto }) => ({
    ...state,
    loading: true,
    loaded: false,
    selectedPostId: dto.postId
  })),
  on(CommentActions.GetCommentsByPostIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(CommentActions.GetCommentsByPostIdSuccess, (state, { comments }) => (
    adapter.addMany(comments, {
      ...state,
      loading: false,
      loaded: true,
    })
  )),

  on(CommentActions.PushManyComments, (state, { comments }) => (
    adapter.addMany(comments, {
      ...state,
      loaded: true,
      loading: false,
      selectedPostId: comments[0].postId,
    })
  )),

  on(CommentActions.AddComment, (state) => ({
    ...state,
    loaded: false,
    loading: true,
    updating: true,
  })),
  on(CommentActions.AddCommentFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    updating: false,
    error,
  })),
  on(CommentActions.AddCommentSuccess, (state, { comment }) => (
    adapter.addOne(comment, {
      ...state,
      loaded: true,
      loading: false,
      updating: false,
    })
  )),

  on(CommentActions.GetCommentById, (state, { commentId }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedId: commentId
  })),
  on(CommentActions.GetCommentByIdFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(CommentActions.GetCommentByIdSuccess, (state, { comment }) => (
    adapter.upsertOne(comment, {
      ...state,
      loaded: true,
      loading: false,
      selectedPostId: comment.postId,
      selectedId: comment._id,
    })
  )),

  on(CommentActions.GetCommentReplies, (state, { dto }) => ({
    ...state,
    loading: true,
    loaded: false,
    selectedId: dto.commentId,
  })),
  on(CommentActions.GetCommentRepliesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(CommentActions.GetCommentRepliesSuccess, (state, { replies }) => (
    adapter.upsertMany(replies, {
      ...state,
      loading: false,
      loaded: true,
    })
  )),

  on(CommentActions.ReactComment, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(CommentActions.ReactCommentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(CommentActions.ReactCommentSuccess, (state, { data }) => {
    const id = data.commentId;
    const entity = state.entities[id];
    if (entity) {
      const alreadyReacted = entity.myReaction?.reactedBy?.username == data.reactedBy.username;
      const hasSameReaction = entity.myReaction?.variant == data.variant;
      return adapter.updateOne({
        id,
        changes: {
          reactionsCount: (alreadyReacted || hasSameReaction)
            ? entity.reactionsCount > 0 
              ? entity.reactionsCount - 1
              : entity.reactionsCount
            : entity.reactionsCount + 1,
          myReaction: hasSameReaction ? null : data,
        }
      }, {
        ...state,
        loading: false,
        loaded: true,
      });
    } else {
      return state
    }
  }),
)
