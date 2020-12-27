import { createAction, props } from '@ngrx/store';
import { Comment } from '../comment.interface';

export enum CommentActionTypes {

  GET_COMMENTS = '[Comment/Api] Get Comments',
  GET_COMMENTS_SUCCESS = '[Comment/Api] Get Comments Success',
  GET_COMMENTS_FAILURE = '[Comment/Api] Get Comments Failure',

  GET_NEXT_COMMENTS = '[Comment/Api] Get Next Comments',
  GET_NEXT_COMMENTS_SUCCESS = '[Comment/Api] Get Next Comments Success',
  GET_NEXT_COMMENTS_FAILURE = '[Comment/Api] Get Next Comments Failure',

  PUSH_MANY_COMMENTS = '[Comment]ByPostId Push Many Comments',

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

export const GetNextComments = createAction(
  CommentActionTypes.GET_NEXT_COMMENTS,
  props<{ postId: string }>()
);
export const GetNextCommentsSuccess = createAction(
  CommentActionTypes.GET_NEXT_COMMENTS_SUCCESS,
  props<{ comments: Comment[] }>()
)
export const GetNextCommentsFailure = createAction(
  CommentActionTypes.GET_NEXT_COMMENTS_FAILURE,
  props<{ error: Error }>()
)

export const PushManyComments = createAction(
  CommentActionTypes.PUSH_MANY_COMMENTS,
  props<{ comments: Comment[] }>()
)