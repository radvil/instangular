import { createReducer, on } from '@ngrx/store';
import { initialCommentState, commentAdapter } from '../states/comment.state';
import * as CommentActions from '../actions/comment.actions';

export const commentReducer = createReducer(
  initialCommentState,

  on(CommentActions.GetCommentsByPostId, (state, { dto }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedPostId: dto.postId
  })),
  on(CommentActions.GetCommentsByPostIdFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(CommentActions.GetCommentsByPostIdSuccess, (state, { comments }) => (
    commentAdapter.addMany(comments, { ...state, loaded: true, loading: false })
  )),

  on(CommentActions.PushManyComments, (state, { comments }) => (
    commentAdapter.addMany(comments, {
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
    commentAdapter.addOne(comment, {
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
    commentAdapter.upsertOne(comment, {
      ...state,
      loaded: true,
      loading: false,
      selectedPostId: comment.postId,
      selectedId: comment._id,
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
      return commentAdapter.updateOne({
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
