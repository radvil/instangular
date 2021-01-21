import { createAction, props } from '@ngrx/store';
import { CreatePostDto, Post } from '../post.interface';

export enum PostActionTypes {

  GET_POSTS = '[Post/API] Get Posts',
  GET_POSTS_SUCCESS = '[Post/API] Get Posts Success',
  GET_POSTS_FAILURE = '[Post/API] Get Posts Failure',

  GET_NEXT_POSTS = '[Post/API] Get Next Posts',
  GET_NEXT_POSTS_SUCCESS = '[Post/API] Get Next Posts Success',
  GET_NEXT_POSTS_FAILURE = '[Post/API] Get Next Posts Failure',

  PUSH_MANY_POSTS = '[Post] Push Many Posts',

  GET_POST_BY_ID = '[Post/API] Get Post By Id',
  GET_POST_BY_ID_SUCCESS = '[Post/API] Get Post By Id Success',
  GET_POST_BY_ID_FAILURE = '[Post/API] Get Post By Id Failure',

  UDPATE_POST_BY_ID = '[Post/API] Update Post By Id',
  UDPATE_POST_BY_ID_SUCCESS = '[Post/API] Update Post By Id Success',
  UDPATE_POST_BY_ID_FAILURE = '[Post/API] Update Post By Id Failure',

}

export const GetPosts = createAction(PostActionTypes.GET_POSTS);
export const GetPostsSuccess = createAction(
  PostActionTypes.GET_POSTS_SUCCESS,
  props<{ posts: Post[] }>()
)
export const GetPostsFailure = createAction(
  PostActionTypes.GET_POSTS_FAILURE,
  props<{ error: Error }>()
)

export const PushManyPosts = createAction(
  PostActionTypes.PUSH_MANY_POSTS,
  props<{ posts: Post[] }>()
)

export const GetPostById = createAction(
  PostActionTypes.GET_POST_BY_ID,
  props<{ postId: string }>()
);
export const GetPostByIdSuccess = createAction(
  PostActionTypes.GET_POST_BY_ID_SUCCESS,
  props<{ post: Post }>()
)
export const GetPostByIdFailure = createAction(
  PostActionTypes.GET_POST_BY_ID_FAILURE,
  props<{ error: Error }>()
)

export const UpdatePostById = createAction(
  PostActionTypes.UDPATE_POST_BY_ID,
  props<{ postId: string, changes: CreatePostDto }>()
);
export const UpdatePostByIdSuccess = createAction(
  PostActionTypes.GET_POST_BY_ID_SUCCESS,
  props<{ post: Post }>()
)
export const UpdatePostByIdFailure = createAction(
  PostActionTypes.GET_POST_BY_ID_FAILURE,
  props<{ error: Error }>()
)