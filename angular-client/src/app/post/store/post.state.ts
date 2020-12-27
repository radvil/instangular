import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { Post } from "../post.interface";

const selectId = (post: Post): string => post._id;

export const postAdapter = createEntityAdapter<Post>({ selectId });

export interface PostState extends EntityState<Post> {
  loaded: boolean;
  loading: boolean;
  selectedId?: string;
  currNext?: number;
  error?: Error;
}

export const selectPostState = createFeatureSelector<PostState>('posts');

export const initialPostState: PostState = postAdapter.getInitialState({
  loaded: false,
  loading: false,
  selectedId: null,
  currNext: 1,
  error: null
})