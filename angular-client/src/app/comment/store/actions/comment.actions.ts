import { createAction, props } from '@ngrx/store';
import { Comment } from 'src/app/comment';
import {
  CommentReaction,
  CreateCommentDto,
  GetCommentsDto,
} from '../../interfaces';

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
  
  REACT_COMMENT = '[Post/API] React Comment',
  REACT_COMMENT_SUCCESS = '[Post/API] React Comment Success',
  REACT_COMMENT_FAILURE = '[Post/API] React Comment Failure',

}

export const GetCommentsByPostId = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID,
  props<{ dto: GetCommentsDto }>()
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

export const ReactComment = createAction(
  CommentActionTypes.REACT_COMMENT,
  props<{ dto: CommentReaction }>()
);

export const ReactCommentSuccess = createAction(
  CommentActionTypes.REACT_COMMENT_SUCCESS,
  props<{ data: CommentReaction }>()
);

export const ReactCommentFailure = createAction(
  CommentActionTypes.REACT_COMMENT_FAILURE,
  props<{ error: Error }>()
);