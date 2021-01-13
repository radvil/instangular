import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { Comment } from "../comment.interface";

const selectId = (comment: Comment): string => comment._id;
const sortComparer = (commentX: Comment, commentY: Comment): number => {
  return commentX.createdAt.toString().localeCompare(commentY.createdAt.toString())
}

export const commentAdapter = createEntityAdapter<Comment>({ selectId, sortComparer });

export interface CommentState extends EntityState<Comment> {
  loaded: boolean;
  loading: boolean;
  selectedId?: string;
  error?: Error;
}

export const $_commentState = createFeatureSelector<CommentState>('comments');

export const initialCommentState: CommentState = commentAdapter.getInitialState({
  loaded: false,
  loading: false,
  selectedId: null,
  error: null
})