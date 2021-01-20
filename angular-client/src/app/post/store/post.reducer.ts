import { createReducer, on } from '@ngrx/store';
import { initialPostState, PostState, postAdapter } from './post.state';
import * as PostActions from './post.actions';
import { PostReaction } from '../interfaces';

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

  on(PostActions.UpdatePostById, (state, { postId }) => ({
    ...state,
    loaded: false,
    loading: true,
    selectedId: postId,
  })),
  on(PostActions.UpdatePostByIdFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    loading: false,
    error,
  })),
  on(PostActions.UpdatePostByIdSuccess, (state, { post }) => (
    postAdapter.updateOne({
      id: post._id,
      changes: post,
    }, { ...state, loaded: true, loading: false })
  )),

  on(PostActions.DeletePostById, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(PostActions.DeletePostByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(PostActions.DeletePostByIdSuccess, (state, { postId }) => (
    postAdapter.removeOne(postId, {
      ...state,
      loading: false,
      loaded: true,
    })
  )),

  on(PostActions.ReactPost, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(PostActions.ReactPostFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(PostActions.ReactPostSuccess, (state, { data }) => {
    const id = data.postId;
    const entity = state.entities[id];
    if (entity) {
      const alreadyReacted = entity.myReaction?.reactedBy?.username == data.reactedBy.username;
      const hasSameReaction = (entity.myReaction?.variant == data.variant);
      return postAdapter.updateOne({
        id,
        changes: {
          reactions: alreadyReacted
            ? hasSameReaction
              ? entity.reactions.filter(x => x.reactedBy.username != data.reactedBy.username)
              : entity.reactions
            : [...entity.reactions, data],
          reactionsCount: (alreadyReacted || hasSameReaction)
            ? entity.reactionsCount > 0
              ? entity.reactionsCount - 1
              : entity.reactionsCount
            : entity.reactionsCount + 1,
          myReaction: hasSameReaction ? null : data,
        }
      }, {
        ...state,
        loading: false,
        loaded: true,
      });
    } else {
      return state
    }
  }),

  on(PostActions.AddPost, (state) => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(PostActions.AddPostFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(PostActions.AddPostSuccess, (state, { data }) => (
    postAdapter.addOne(data, {
      ...state,
      loading: false,
      loaded: true,
    })
  )),
)
