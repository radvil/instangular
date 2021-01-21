export class CreatePostCommentDto {
  postId: string;
  text: string;
  repliedTo?: string;
}

export class GetPostCommentsDto {
  postId?: string;
  commentId?: string;
  pageNumber: number;
  limit?: number;
}
