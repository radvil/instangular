import { createReducer, on } from '@ngrx/store';
import { initialPostState, PostState, postAdapter } from './post.state';
import * as PostActions from './post.actions';

export const postReducer = createReducer(
  initialPostState,

  on(PostActions.ApiGetPosts, (state: PostState) => ({
    ...state,
    loaded: false,
    loading: true
  })),
  on(PostActions.ApiGetPostsFailure, (state: PostState, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error
  })),
  on(PostActions.ApiGetPostsSuccess, (state: PostState, { posts }) => (
    postAdapter.setAll(posts, { ...state, loaded: true, loading: false })
  )),

  on(PostActions.ApiGetNextPosts, (state: PostState) => ({
    ...state,
    loaded: false,
    loading: true
  })),
  on(PostActions.ApiGetNextPostsFailure, (state: PostState, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error
  })),
  on(PostActions.ApiGetNextPostsSuccess, (state: PostState, { posts }) => (
    postAdapter.addMany([...posts], {
      ...state,
      loaded: true,
      loading: false,
      currNext: posts.length > 0 ? ++state.currNext : state.currNext,
    })
  )),
  on(PostActions.PushManyPosts, (state: PostState, { posts }) => (
    postAdapter.addMany([...posts], { ...state })
  )),
)
