import { createAction, props } from '@ngrx/store';
import { Comment } from 'src/app/comment';
import { CreateCommentDto, GetCommentsByPostIdDto } from '../comment.interface';

export enum CommentActionTypes {

  GET_COMMENTS_BY_POST_ID = '[Comment/Api] Get Comments By PostId',
  GET_COMMENTS_BY_POST_ID_SUCCESS = '[Comment/Api] Get Comments By PostId Success',
  GET_COMMENTS_BY_POST_ID_FAILURE = '[Comment/Api] Get Comments By PostId Failure',

  PUSH_MANY_COMMENTS = '[Comment] Push Many Comments',

  ADD_COMMENT = '[Comment/Api] Add Comment',
  ADD_COMMENT_SUCCESS = '[Comment/Api] Add Comment Success',
  ADD_COMMENT_FAILURE = '[Comment/Api] Add Comment Failure',

}

export const GetCommentsByPostId = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID,
  props<{ dto: GetCommentsByPostIdDto }>()
);
export const GetCommentsByPostIdSuccess = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID_SUCCESS,
  props<{ comments: Comment[] }>()
)
export const GetCommentsByPostIdFailure = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID_FAILURE,
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