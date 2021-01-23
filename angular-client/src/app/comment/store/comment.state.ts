import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store'
import { Comment } from "../comment.interface";

const selectId = (comment: Comment): string => comment._id;
const sortByLatestDate = (commentX: Comment, commentY: Comment): number => {
  return commentX.createdAt?.toString().localeCompare(commentY.createdAt?.toString());
}

export const commentAdapter = createEntityAdapter<Comment>({
  selectId,
  sortComparer: sortByLatestDate
});

export interface CommentState extends EntityState<Comment> {
  loaded: boolean;
  loading: boolean;
  updating?: boolean;
  selectedId?: string;
  selectedPostId?: string;
  error?: Error;
}

export const $_commentState = createFeatureSelector<CommentState>('comments');

export const initialCommentState: CommentState = commentAdapter.getInitialState({
  loaded: false,
  loading: false,
  updating: false,
  selectedId: null,
  selectedPostId: null,
  error: null
})