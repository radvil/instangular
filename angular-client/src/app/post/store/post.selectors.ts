import { createSelector } from '@ngrx/store';
import { $_userSelectedUsername } from 'src/app/user/store/user.selectors';
import { postAdapter, $_postState } from './post.state';
import { PostState } from './post.state'

const { selectAll, selectEntities } = postAdapter.getSelectors();

export const $_postLoading = createSelector(
  $_postState,
  (state: PostState) => state.loading
);
export const $_postLoaded = createSelector(
  $_postState,
  (state: PostState) => state.loaded
);
export const $_postError = createSelector(
  $_postState,
  (state: PostState) => state.error
);
export const $_postSelectedId = createSelector(
  $_postState,
  (state: PostState) => state.selectedId
);
export const $_postCurrNext = createSelector(
  $_postState,
  (state: PostState) => state.currNext
);
export const $_posts = createSelector($_postState, selectAll);
export const $_postEntities = createSelector($_postState, selectEntities);
export const $_postsOfUser = createSelector(
  $_posts,
  $_userSelectedUsername,
  (posts, username) => posts.filter(post => post.postedBy.username == username)
)