import { ActionReducerMap } from '@ngrx/store';
import { createFeatureSelector } from "@ngrx/store";

import { CommentState } from './states/comment.state';
import { ReplyState } from './states/reply.state';
import { commentReducer } from './reducers/comment.reducer';
import { replyReducer } from './reducers/reply.reducer';

export const featureName = 'comments_feature';

export interface FeatureStates {
  comments: CommentState;
  replies: ReplyState;
}

export const $_FeatureStates = createFeatureSelector<FeatureStates>(featureName);

export const featureReducers: ActionReducerMap<FeatureStates> = {
  comments: commentReducer,
  replies: replyReducer,
}