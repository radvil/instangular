import { createAction, props } from '@ngrx/store';
import { Reply } from '../../interfaces';
import {
  GetRepliesDto,
  CreateReplyDto,
} from '../../interfaces';

export enum ReplyActionTypes {

  GET_REPLIES_BY_COMMENT_ID = '[Reply/Api] Get Replies By CommentId',
  GET_REPLIES_BY_COMMENT_ID_SUCCESS = '[Reply/Api] Get Replies By CommentId Success',
  GET_REPLIES_BY_COMMENT_ID_FAILURE = '[Reply/Api] Get Replies By CommentId Failure',

  PUSH_MANY_REPLIES = '[Reply] Push Many Replies',

  ADD_NEW_REPLY = '[Reply/Api] Add New Reply',
  ADD_NEW_REPLY_SUCCESS = '[Reply/Api] Add New Reply Success',
  ADD_NEW_REPLY_FAILURE = '[Reply/Api] Add New Reply Failure',
}

export const GetRepliesByCommentId = createAction(
  ReplyActionTypes.GET_REPLIES_BY_COMMENT_ID,
  props<{ dto: GetRepliesDto }>()
);
export const GetRepliesByCommentIdSuccess = createAction(
  ReplyActionTypes.GET_REPLIES_BY_COMMENT_ID_SUCCESS,
  props<{ replies: Reply[] }>()
)
export const GetRepliesByCommentIdFailure = createAction(
  ReplyActionTypes.GET_REPLIES_BY_COMMENT_ID_FAILURE,
  props<{ error: Error }>()
)

export const PushManyReplies = createAction(
  ReplyActionTypes.PUSH_MANY_REPLIES,
  props<{ replies: Reply[] }>()
)

export const AddNewReply = createAction(
  ReplyActionTypes.ADD_NEW_REPLY,
  props<{ dto: CreateReplyDto }>()
)
export const AddNewReplySuccess = createAction(
  ReplyActionTypes.ADD_NEW_REPLY_SUCCESS,
  props<{ reply: Reply }>()
)
export const AddNewReplyFailure = createAction(
  ReplyActionTypes.ADD_NEW_REPLY_FAILURE,
  props<{ error: Error }>()
)