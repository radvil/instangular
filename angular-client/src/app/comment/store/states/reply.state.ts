import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Reply } from "../../interfaces";

const selectId = (reply: Reply): string => reply._id;
const sortByLatestDate = (replyA: Reply, replyB: Reply): number => {
  return replyA.createdAt?.toString().localeCompare(replyB.createdAt?.toString());
}

export const replyAdapter = createEntityAdapter<Reply>({
  selectId,
  sortComparer: sortByLatestDate
});

export interface ReplyState extends EntityState<Reply> {
  selectedId: string;
  selectedPostId: string;
  selectedCommentId: string;

  loaded: boolean;
  loading: boolean;
  modifying?: boolean;
  error?: Error;
}

export const initialReplyState: ReplyState = replyAdapter.getInitialState({
  selectedId: null,
  selectedPostId: null,
  selectedCommentId: null,

  loaded: false,
  loading: false,
  modifying: false,
  error: null
})