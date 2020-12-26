import { createAction, props } from '@ngrx/store';
import { Post } from '../post.interface';

export enum PostActionTypes {

  GET_POSTS = '[Post] Get Posts',
  GET_POSTS_SUCCESS = '[Post/API] Get Posts Success',
  GET_POSTS_FAILURE = '[Post/API] Get Posts Failure',

  GET_NEXT_POSTS = '[Post] Get Next Posts',
  GET_NEXT_POSTS_SUCCESS = '[Post/API] Get Next Posts Success',
  GET_NEXT_POSTS_FAILURE = '[Post/API] Get Next Posts Failure',

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

export const GetNextPosts = createAction(PostActionTypes.GET_NEXT_POSTS);
export const GetNextPostsSuccess = createAction(
    PostActionTypes.GET_NEXT_POSTS_SUCCESS,
    props<{ posts: Post[] }>()
)
export const GetNextPostsFailure = createAction(
    PostActionTypes.GET_NEXT_POSTS_FAILURE,
    props<{ error: Error }>()
)