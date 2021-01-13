import { createAction, props } from '@ngrx/store';
import { Comment } from 'src/app/comment';
import { CreateCommentDto } from '../comment.interface';

export enum CommentActionTypes {

  GET_COMMENTS = '[Comment/Api] Get Comments',
  GET_COMMENTS_SUCCESS = '[Comment/Api] Get Comments Success',
  GET_COMMENTS_FAILURE = '[Comment/Api] Get Comments Failure',

  PUSH_MANY_COMMENTS = '[Comment]ByPostId Push Many Comments',

  ADD_COMMENT = '[Comment/Api] Add Comment',
  ADD_COMMENT_SUCCESS = '[Comment/Api] Add Comment Success',
  ADD_COMMENT_FAILURE = '[Comment/Api] Add Comment Failure',

}

export const GetComments = createAction(
  CommentActionTypes.GET_COMMENTS,
  props<{ postId: string }>()
);
export const GetCommentsSuccess = createAction(
  CommentActionTypes.GET_COMMENTS_SUCCESS,
  props<{ comments: Comment[] }>()
)
export const GetCommentsFailure = createAction(
  CommentActionTypes.GET_COMMENTS_FAILURE,
  props<{ error: Error }>()
)

export const PushManyComments = createAction(
  CommentActionTypes.PUSH_MANY_COMMENTS,
  props<{ comments: Comment[] }>()
)

export const AddComment = createAction(
  CommentActionTypes.ADD_COMMENT,
  props<{ createCommentDto: CreateCommentDto }>()
);
export const AddCommentSuccess = createAction(
  CommentActionTypes.ADD_COMMENT_SUCCESS,
  props<{ comment: Comment }>()
)
export const AddCommentFailure = createAction(
  CommentActionTypes.ADD_COMMENT_FAILURE,
  props<{ error: Error }>()
)