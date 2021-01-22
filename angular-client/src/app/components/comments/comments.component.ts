import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateCommentDto } from 'src/app/comment';
import { Post } from 'src/app/post';
import { User } from 'src/app/user';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent  {

  @Input() post: Post;
  @Input() authUser: User;
  @Input() comments: Comment[];
  @Input() commentsHasNextPage: boolean;
  @Input() isCommentsLoading: boolean = false;
  @Input() isTruncatedTexts: boolean = false;
  @Output() onViewCommentsClicked = new EventEmitter<string>();
  @Output() onViewRepliesClicked = new EventEmitter<string>();
  @Output() onUserProfileClicked = new EventEmitter<string>();
  @Output() onAddCommentClicked = new EventEmitter<any>();
  public commentInputText: string;

  public viewPostComments(postId: string) {
    this.onViewCommentsClicked.emit(postId);
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  public reactToComment(commentId: string) {
    alert('TODO:// reactToComment(commentId: string)');
  }

  public replyToComment(commentId: string) {
    alert('TODO:// replyToComment(commentId: string)');
    // dialog form; >> adding new comment;
  }

  public viewCommentReactions(commentId: string) {
    alert('TODO:// View Comment Reactions');
  }

  public viewCommentReplies(commentId: string) {
    this.onViewRepliesClicked.emit(commentId);
    // navigate to comment detail and it's replies
  }

  getCommentClass(authorUsername: string): string {
    let currentClasses = "comment__box";
    if (this.authUser.username === authorUsername) currentClasses += ' self';
    return currentClasses;
  }

  public emitAddComment(): void {
    if (this.post && this.commentInputText) {
      const comment = {
        postId: this.post._id,
        text: this.commentInputText,
        commentedBy: this.authUser._id,
      } as CreateCommentDto;
      this.onAddCommentClicked.emit(comment);
      this.commentInputText = "";
    }
  }
}
