import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CreateCommentDto } from 'src/app/comment';
import { Post } from 'src/app/post';
import { User } from 'src/app/user';
import { ReactionsDialogComponent } from 'src/app/_shared/components';
import { compareToGetClass } from 'src/app/_shared/utils';
import { CommentReaction } from '../../interfaces';
import { ReactComment } from '../../store/actions';
import { CommentState, ReplyState } from '../../store/states';

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

  public reactionsDialogRef: MatDialogRef<ReactionsDialogComponent>;
  private _subscription = new Subscription()

  constructor(
    private _dialog: MatDialog,
    private _store: Store<CommentState | ReplyState>,
  ) { }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }


  public viewPostComments(postId: string) {
    this.onViewCommentsClicked.emit(postId);
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  public reactToComment(commentId: string) {
    this.reactionsDialogRef = this._dialog.open(ReactionsDialogComponent, {
      width: '666px',
      panelClass: 'container',
    });

    const reactAndCloseDialog$ = this.reactionsDialogRef.beforeClosed().pipe(
      tap((variant: string) => {
        const dto = <CommentReaction>{
          commentId,
          variant,
          reactedBy: this.authUser,
        }
        this._store.dispatch(ReactComment({ dto }));
      })
    )

    this._subscription.add(reactAndCloseDialog$.subscribe());
  }

  public replyToComment(commentId: string) {
    alert('TODO:// replyToComment(commentId: string)');
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

  // public emitAddComment(inputText: string): void {
  //   if (this.post && inputText) {
  //     const comment = <CreateCommentDto>{
  //       postId: this.post._id,
  //       text: inputText,
  //       commentedBy: this.authUser._id,
  //     };
  //     this.onAddCommentClicked.emit(comment);
  //   }
  // }
}
