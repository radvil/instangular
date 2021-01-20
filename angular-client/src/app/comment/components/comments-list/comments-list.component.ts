import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CreatePostCommentDto, PostComment } from 'src/app/comment/interfaces';
import { Post } from 'src/app/post/interfaces';
import { User } from 'src/app/user/interfaces';
import { ReactionsDialogComponent } from 'src/app/_shared/components';
import { compareToGetClass } from 'src/app/_shared/utils';
import { CommentReaction } from '../../interfaces';
import { State as CommentState } from '../../store/comment.state';
import { ReactComment } from '../../store/comment.actions';

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
  @Output() onAddCommentClicked = new EventEmitter<CreatePostCommentDto>();

  public reactionsDialogRef: MatDialogRef<ReactionsDialogComponent>;
  private _subscription = new Subscription();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, comment: PostComment) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': comment };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuEditAction(comment: PostComment) {
    alert(`Click on Action 1 for ${comment._id}`);
  }

  onContextMenuDeleteAction(comment: PostComment) {
    alert(`Click on Action 2 for ${comment._id}`);
  }

  public viewPostComments(postId: string) {
    this.onViewCommentsClicked.emit(postId);
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  public openReactionDialog(commentId: string) {
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

  public clickComment(commentId: string) {
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

  constructor(
    private _dialog: MatDialog,
    private _store: Store<CommentState>,
  ) { }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
