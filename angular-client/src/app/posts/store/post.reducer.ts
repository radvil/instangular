import { createReducer, on } from '@ngrx/store';
import { initialPostState, PostState, postAdapter } from './post.state';
import * as PostActions from './post.actions';

export const postReducer = createReducer(
  initialPostState,

  on(PostActions.GetPosts, (state: PostState) => ({
    ...state,
    loaded: false,
    loading: true
  })),
  on(PostActions.GetPostsFailure, (state: PostState, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error
  })),
  on(PostActions.GetPostsSuccess, (state: PostState, { posts }) => (
    postAdapter.setAll(posts, { ...state, loaded: true, loading: false })
  )),

  on(PostActions.GetNextPosts, (state: PostState) => ({
    ...state,
    loaded: false,
    loading: true
  })),
  on(PostActions.GetNextPostsFailure, (state: PostState, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error
  })),
  on(PostActions.GetNextPostsSuccess, (state: PostState, { posts }) => (
    postAdapter.addMany([...posts], {
      ...state,
      loaded: true,
      loading: false,
      currNext: posts.length > 0 ? ++state.currNext : state.currNext,
    })
  )),
)
