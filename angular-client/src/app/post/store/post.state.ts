import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { Post } from "../interfaces";

const selectId = (post: Post): string => post._id;
const sortComparer = (postX: Post, postY: Post): number => {
  return postY.createdAt?.toString().localeCompare(postX.createdAt?.toString())
}

export const postAdapter = createEntityAdapter<Post>({ selectId, sortComparer });

export interface PostState extends EntityState<Post> {
  loaded: boolean;
  loading: boolean;
  selectedId?: string;
  error?: Error;
}

export const $_postState = createFeatureSelector<PostState>('posts');

export const initialPostState: PostState = postAdapter.getInitialState({
  loaded: false,
  loading: false,
  selectedId: null,
  error: null
})