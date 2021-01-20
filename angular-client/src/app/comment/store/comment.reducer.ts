import { createReducer, on } from '@ngrx/store';
import { initialState, adapter } from './comment.state';
import * as CommentActions from './comment.actions';

export const commentReducer = createReducer(
  initialState,

  on(CommentActions.GetCommentsByPostId, (state, { dto }) => ({
    ...state,
    isLoading: true,
    isLoaded: false,
    selectedPostId: dto.postId
  })),
  on(CommentActions.GetCommentsByPostIdFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    error,
  })),
  on(CommentActions.GetCommentsByPostIdSuccess, (state, { comments }) => (
    adapter.addMany(comments, {
      ...state,
      isLoading: false,
      isLoaded: true,
    })
  )),

  on(CommentActions.PushManyComments, (state, { comments }) => (
    adapter.addMany(comments, {
      ...state,
      isLoaded: true,
      isLoading: false,
      selectedPostId: comments[0].postId,
    })
  )),

  on(CommentActions.AddComment, (state) => ({
    ...state,
    isLoaded: false,
    isLoading: true,
  })),
  on(CommentActions.AddCommentFailure, (state, { error }) => ({
    ...state,
    isLoaded: false,
    isLoading: false,
    error,
  })),
  on(CommentActions.AddCommentSuccess, (state, { comment }) => (
    adapter.addOne(comment, {
      ...state,
      isLoaded: true,
      isLoading: false,
    })
  )),

  on(CommentActions.EditComment, (state, { dto }) => ({
    ...state,
    isLoaded: false,
    isLoading: true,
    selectedId: dto.commentId
  })),
  on(CommentActions.EditCommentFailure, (state, { error }) => ({
    ...state,
    isLoaded: false,
    isLoading: false,
    error,
  })),
  on(CommentActions.EditCommentSuccess, (state, { dto }) => {
    let { commentId: id, ...changes } = dto;
    return adapter.updateOne({ id, changes }, {
      ...state,
      isLoaded: true,
      isLoading: false,
    })
  }),

  on(CommentActions.GetCommentById, (state, { commentId }) => {
    return {
      ...state,
      isLoaded: false,
      isLoading: true,
      selectedId: commentId
    }
  }),
  on(CommentActions.GetCommentByIdFailure, (state, { error }) => ({
    ...state,
    isLoaded: false,
    isLoading: false,
    error,
  })),
  on(CommentActions.GetCommentByIdSuccess, (state, { comment }) => (
    adapter.upsertOne(comment, {
      ...state,
      isLoaded: true,
      isLoading: false,
      selectedPostId: comment.postId,
      selectedId: comment._id,
    })
  )),

  on(CommentActions.GetCommentReplies, (state, { dto }) => ({
    ...state,
    isLoading: true,
    isLoaded: false,
    selectedId: dto.commentId,
  })),
  on(CommentActions.GetCommentRepliesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    error,
  })),
  on(CommentActions.GetCommentRepliesSuccess, (state, { replies }) => (
    adapter.upsertMany(replies, {
      ...state,
      isLoading: false,
      isLoaded: true,
    })
  )),

  on(CommentActions.ReactComment, (state) => ({
    ...state,
    isLoading: true,
    isLoaded: false,
  })),
  on(CommentActions.ReactCommentFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
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
          reactionsCount: alreadyReacted
            ? entity.reactionsCount > 0
              ? entity.reactionsCount - 1
              : entity.reactionsCount
            : entity.reactionsCount + 1,
          myReaction: hasSameReaction ? null : data,
        }
      }, {
        ...state,
        isLoading: false,
        isLoaded: true,
      });
    } else {
      return state
    }
  }),

  on(CommentActions.DeleteComment, (state, { commentId }) => ({
    ...state,
    isLoading: true,
    isLoaded: false,
    selectedId: commentId,
  })),
  on(CommentActions.DeleteCommentFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    isLoaded: false,
    error,
  })),
  on(CommentActions.DeleteCommentSuccess, (state, { commentId }) => (
    adapter.removeOne(commentId, {
      ...state,
      isLoading: false,
      isLoaded: true,
    })
  )),
)
