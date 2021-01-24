import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateCommentDto } from 'src/app/comment';
import { compareToGetClass } from 'src/app/_shared';
import { Post } from 'src/app/post';
import { User } from 'src/app/user';

@Component({
  selector: 'nsg-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent {

  @Input() post: Post;
  @Input() authUser: User;
  @Input() comments: Comment[];
  @Input() commentsHasNextPage: boolean;
  @Input() isCommentsLoading: boolean = false;
  @Input() isTruncatedTexts: boolean = false;
  @Output() onViewCommentsClicked = new EventEmitter<string>();
  @Output() onViewRepliesClicked = new EventEmitter<string>();
  @Output() onUserProfileClicked = new EventEmitter<string>();
  @Output() onAddCommentClicked = new EventEmitter<CreateCommentDto>();

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
    return compareToGetClass(this.authUser.username, authorUsername);
  }

  public emitAddComment(inputText: string): void {
    if (this.post && inputText) {
      const comment = <CreateCommentDto>{
        postId: this.post._id,
        text: inputText,
        commentedBy: this.authUser._id,
      };
      this.onAddCommentClicked.emit(comment);
    }
  }
}
