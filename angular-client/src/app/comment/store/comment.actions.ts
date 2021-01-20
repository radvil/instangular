import { createAction, props } from '@ngrx/store';
import { PostComment } from 'src/app/comment';
import {
  CommentReaction,
  CreatePostCommentDto,
  GetCommentRepliesDto,
  GetPostCommentsDto,
} from '../interfaces';

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

  GET_COMMENT_REPLIES = '[Comment/Api] Get Comment Replies',
  GET_COMMENT_REPLIES_SUCCESS = '[Comment/Api] Get Comment Replies Success',
  GET_COMMENT_REPLIES_FAILURE = '[Comment/Api] Get Comment Replies Failure',
  
  REACT_COMMENT = '[Comment/API] React Comment',
  REACT_COMMENT_SUCCESS = '[Comment/API] React Comment Success',
  REACT_COMMENT_FAILURE = '[Comment/API] React Comment Failure',

  DELETE_COMMENT = '[Comment/API] Delete Comment',
  DELETE_COMMENT_SUCCESS = '[Comment/API] Delete Comment Success',
  DELETE_COMMENT_FAILURE = '[Comment/API] Delete Comment Failure',

}

export const GetCommentsByPostId = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID,
  props<{ dto: GetPostCommentsDto }>()
);
export const GetCommentsByPostIdSuccess = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID_SUCCESS,
  props<{ comments: PostComment[] }>()
)
export const GetCommentsByPostIdFailure = createAction(
  CommentActionTypes.GET_COMMENTS_BY_POST_ID_FAILURE,
  props<{ error: Error }>()
)

export const PushManyComments = createAction(
  CommentActionTypes.PUSH_MANY_COMMENTS,
  props<{ comments: PostComment[] }>()
)

export const AddComment = createAction(
  CommentActionTypes.ADD_COMMENT,
  props<{ dto: CreatePostCommentDto }>()
);
export const AddCommentSuccess = createAction(
  CommentActionTypes.ADD_COMMENT_SUCCESS,
  props<{ comment: PostComment }>()
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
  props<{ comment: PostComment }>()
)
export const GetCommentByIdFailure = createAction(
  CommentActionTypes.GET_COMMENT_BY_ID_FAILURE,
  props<{ error: Error }>()
)

export const GetCommentReplies = createAction(
  CommentActionTypes.GET_COMMENT_REPLIES,
  props<{ dto: GetCommentRepliesDto }>(),
);
export const GetCommentRepliesSuccess = createAction(
  CommentActionTypes.GET_COMMENT_REPLIES_SUCCESS,
  props<{ replies: PostComment[] }>(),
)
export const GetCommentRepliesFailure = createAction(
  CommentActionTypes.GET_COMMENT_REPLIES_FAILURE,
  props<{ error: Error }>(),
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

export const DeleteComment = createAction(
  CommentActionTypes.DELETE_COMMENT,
  props<{ commentId: string }>()
);

export const DeleteCommentSuccess = createAction(
  CommentActionTypes.DELETE_COMMENT_SUCCESS,
  props<{ commentId: string }>()
);

export const DeleteCommentFailure = createAction(
  CommentActionTypes.DELETE_COMMENT_FAILURE,
  props<{ error: Error }>()
);