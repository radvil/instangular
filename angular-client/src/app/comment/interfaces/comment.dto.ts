export class CreatePostCommentDto {
  postId: string;
  text: string;
  repliedTo?: string;
}

export class EditCommentDto {
  commentId: string;
  text: string;
}

export class GetPostCommentsDto {
  postId: string;
  pageNumber: number;
  limit?: number;
}

export class GetCommentRepliesDto {
  commentId: string;
  pageNumber: number;
  limit?: number;
}
