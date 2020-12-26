import { createAction, props } from '@ngrx/store';
import { Post } from '../post.interface';

export enum PostActionTypes {

  API_GET_POSTS = '[Post/API] Get Posts',
  API_GET_POSTS_SUCCESS = '[Post/API] Get Posts Success',
  API_GET_POSTS_FAILURE = '[Post/API] Get Posts Failure',

  API_GET_NEXT_POSTS = '[Post/API] Get Next Posts',
  API_GET_NEXT_POSTS_SUCCESS = '[Post/API] Get Next Posts Success',
  API_GET_NEXT_POSTS_FAILURE = '[Post/API] Get Next Posts Failure',

  PUSH_MANY_POSTS = '[Post] Push Many Posts',

}

export const ApiGetPosts = createAction(PostActionTypes.API_GET_POSTS);
export const ApiGetPostsSuccess = createAction(
    PostActionTypes.API_GET_POSTS_SUCCESS,
    props<{ posts: Post[] }>()
)
export const ApiGetPostsFailure = createAction(
    PostActionTypes.API_GET_POSTS_FAILURE,
    props<{ error: Error }>()
)

export const ApiGetNextPosts = createAction(PostActionTypes.API_GET_NEXT_POSTS);
export const ApiGetNextPostsSuccess = createAction(
    PostActionTypes.API_GET_NEXT_POSTS_SUCCESS,
    props<{ posts: Post[] }>()
)
export const ApiGetNextPostsFailure = createAction(
    PostActionTypes.API_GET_NEXT_POSTS_FAILURE,
    props<{ error: Error }>()
)

export const PushManyPosts = createAction(
  PostActionTypes.PUSH_MANY_POSTS,
  props<{ posts: Post[] }>()
)