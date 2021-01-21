import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { Post } from "../interfaces";

export const postAdapter = createEntityAdapter<Post>({
  selectId: (post) => post._id,
  sortComparer: (x, y) => {
    return y.createdAt.toString().localeCompare(x.createdAt.toString());
  },
});

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