import { createReducer, on } from '@ngrx/store';
import { initialCommentState, commentAdapter } from './comment.state';
import * as CommentActions from './comment.actions';

export const commentReducer = createReducer(
  initialCommentState,

  on(CommentActions.GetComments, (state, { postId }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedPostId: postId,
  })),
  on(CommentActions.GetCommentsFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(CommentActions.GetCommentsSuccess, (state, { comments }) => (
    commentAdapter.addMany(comments, { ...state, loaded: true, loading: false })
  )),

  on(CommentActions.PushManyComments, (state, { comments }) => (
    commentAdapter.addMany(comments, { ...state, loaded: true, loading: false })
  )),

  on(CommentActions.AddComment, (state) => ({
    ...state,
    loaded: false,
    loading: true,
  })),
  on(CommentActions.AddCommentFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(CommentActions.AddCommentSuccess, (state, { comment }) => (
    commentAdapter.addOne(comment, { ...state, loaded: true, loading: false })
  )),
)
