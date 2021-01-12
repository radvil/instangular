import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/user';
import { Comment, Post } from '../../post.interface';

@Component({
  selector: 'app-post-item-footer',
  templateUrl: './post-item-footer.component.html',
  styleUrls: ['./post-item-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemFooterComponent {

  @Input() style = "default";
  @Input() post: Post;
  @Input() comments: Comment[];
  @Input() authUser: User;
  @Input() viewCommentsText: string = "View previous comments";
  @Output() onViewCommentsClicked = new EventEmitter<string>();
  @Output() onUserProfileClicked = new EventEmitter<string>();
  @Output() onAddCommentClicked = new EventEmitter<string>();

  public viewPostComments(postId: string) {
    this.onViewCommentsClicked.emit(postId);
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  getCommentClass(username: string): string {
    return this.authUser.username === username ? 'comment self': 'comment';
  }

  public emitAddComment(postId: string): void {
    this.onAddCommentClicked.emit(postId);
  }

}
