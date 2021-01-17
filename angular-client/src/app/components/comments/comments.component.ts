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
  @Input() comments: Comment[];
  @Input() authUser: User;
  @Input() isCommentsLoading: boolean = false;
  @Input() isTruncatedTexts: boolean = false;
  @Output() onViewCommentsClicked = new EventEmitter<string>();
  @Output() onUserProfileClicked = new EventEmitter<string>();
  @Output() onAddCommentClicked = new EventEmitter<any>();
  public commentInputText: string;


  public viewPostComments(postId: string) {
    this.onViewCommentsClicked.emit(postId);
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  getCommentClass(username: string): string {
    let currentClasses = "comment__box";
    if (this.authUser.username === username) currentClasses += ' self';
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
