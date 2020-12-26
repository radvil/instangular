import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { Post } from "../post.interface";

const selectId = (post: Post): string => post._id;
const sortComparer = (postX: Post, postY: Post): number => {
  return postX.createdAt.toString().localeCompare(postY.createdAt.toString())
}

export const postAdapter = createEntityAdapter<Post>({ selectId, sortComparer });

export interface PostState extends EntityState<Post> {
  loaded: boolean;
  loading: boolean;
  selectedId?: string;
  currNext?: number;
  error?: Error;
}

export const $_postState = createFeatureSelector<PostState>('posts');

export const initialPostState: PostState = postAdapter.getInitialState({
  loaded: false,
  loading: false,
  selectedId: null,
  currNext: 1,
  error: null
})