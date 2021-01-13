import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/user';
import { Post } from 'src/app/post';
import { Comment, CreateCommentDto } from 'src/app/comment';

@Component({
  selector: 'app-post-card-footer',
  templateUrl: './post-card-footer.component.html',
  styleUrls: ['./post-card-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardFooterComponent {

  @Input() style = "default";
  @Input() post: Post;
  @Input() comments: Comment[];
  @Input() authUser: User;
  @Input() viewCommentsText: string = "View previous comments";
  @Output() onViewCommentsClicked = new EventEmitter<string>();
  @Output() onUserProfileClicked = new EventEmitter<string>();
  @Output() onAddCommentClicked = new EventEmitter<any>();
  public commentText = "";

  constructor() { }

  public viewPostComments(postId: string) {
    this.onViewCommentsClicked.emit(postId);
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  getCommentClass(username: string): string {
    return this.authUser.username === username ? 'comment self' : 'comment';
  }

  public emitAddComment(): void {
    if (this.post && this.commentText) {
      const comment = {
        postId: this.post._id,
        text: this.commentText,
        commentedBy: this.authUser._id,
      } as CreateCommentDto;
      this.onAddCommentClicked.emit(comment);
      this.commentText = "";
    }
  }

}
