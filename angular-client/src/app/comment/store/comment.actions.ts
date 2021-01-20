import { createAction, props } from '@ngrx/store';
import { Comment } from 'src/app/comment';
import {
  CreateCommentDto,
  GetCommentsByPostIdDto,
  GetRepliesByCommentIdDto
} from '../comment.interface';

export enum CommentActionTypes {

  GET_COMMENTS_BY_POST_ID = '[Comment/Api] Get Comments By PostId',
  GET_COMMENTS_BY_POST_ID_SUCCESS = '[Comment/Api] Get Comments By PostId Success',
  GET_COMMENTS_BY_POST_ID_FAILURE = '[Comment/Api] Get Comments By PostId Failure',

  PUSH_MANY_COMMENTS = '[Comment] Push Many Comments',

  ADD_COMMENT = '[Comment/Api] Add Comment',
  ADD_COMMENT_SUCCESS = '[Comment/Api] Add Comment Success',
  ADD_COMMENT_FAILURE = '[Comment/Api] Add Comment Failure',

  GET_COMMENT_BY_ID = '[Comment/Api] Get Comment By Id',
  GET_COMMENT_BY_ID_SUCCESS = '[Comment/Api] Get Comment By Id Success',
  GET_COMMENT_BY_ID_FAILURE = '[Comment/Api] Get Comment By Id Failure',

  GET_REPLIES = '[Comment/Api] Get Replies',
  GET_REPLIES_SUCCESS = '[Comment/Api] Get Replies Success',
  GET_REPLIES_FAILURE = '[Comment/Api] Get Replies Failure',

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

export const GetCommentById = createAction(
  CommentActionTypes.GET_COMMENT_BY_ID,
  props<{ commentId: string }>()
);
export const GetCommentByIdSuccess = createAction(
  CommentActionTypes.GET_COMMENT_BY_ID_SUCCESS,
  props<{ comment: Comment }>()
)
export const GetCommentByIdFailure = createAction(
  CommentActionTypes.GET_COMMENT_BY_ID_FAILURE,
  props<{ error: Error }>()
)

export const GetReplies = createAction(
  CommentActionTypes.GET_REPLIES,
  props<{ dto: GetRepliesByCommentIdDto }>()
);
export const GetRepliesSuccess = createAction(
  CommentActionTypes.GET_REPLIES_SUCCESS,
  props<{ commentId: string, replies: Comment[] }>()
)
export const GetRepliesFailure = createAction(
  CommentActionTypes.GET_REPLIES_FAILURE,
  props<{ error: Error }>()
)
