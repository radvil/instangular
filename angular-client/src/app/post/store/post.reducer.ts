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
    postAdapter.addMany(posts, { ...state, loaded: true, loading: false })
  )),

  on(PostActions.PushManyPosts, (state: PostState, { posts }) => (
    postAdapter.addMany(posts, { ...state })
  )),

  on(PostActions.GetPostById, (state, { postId }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedId: postId,
  })),
  on(PostActions.GetPostByIdFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(PostActions.GetPostByIdSuccess, (state, { post }) => (
    postAdapter.addOne(post, { ...state, loaded: true, loading: false })
  )),
)
