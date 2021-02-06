import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  CreatePostCommentDto,
  EditCommentDto,
  PostComment,
} from 'src/app/comment/interfaces';
import { User } from 'src/app/user/interfaces';
import {
  ConfirmDialogComponent,
  ReactionsDialogComponent,
  CommentDialogComponent,
} from 'src/app/_shared/components';
import { compareToGetClass } from 'src/app/_shared/utils';
import { CommentReaction } from '../../interfaces';
import { State as CommentState } from '../../store/comment.state';
import {
  DeleteComment,
  EditComment,
  ReactComment,
} from '../../store/comment.actions';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent {
  @Input() authUser: User;
  @Input() comments: Comment[];
  @Input() isLoading: boolean = false;
  @Input() isTruncatedTexts: boolean = false;
  @Output() clickViewReplies = new EventEmitter<string>();
  @Output() onAddCommentClicked = new EventEmitter<CreatePostCommentDto>();
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  public contextMenuPosition = { x: '0px', y: '0px' };
  public commentDialogRef: MatDialogRef<CommentDialogComponent>;
  public reactionsDialogRef: MatDialogRef<ReactionsDialogComponent>;
  public deleteDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _subscription = new Subscription();

  constructor(
    private _dialog: MatDialog,
    private _store: Store<CommentState>
  ) { }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  isPermitted(commentAuthorId: string): boolean {
    return this.authUser?._id === commentAuthorId;
  }

  onContextMenu(event: MouseEvent, comment: PostComment) {
    if (this.isPermitted(comment.commentedBy._id)) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = { item: comment };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  onContextMenuEditAction(comment: PostComment) {
    this.commentDialogRef = this._dialog.open(CommentDialogComponent, {
      data: { comment, authUser: this.authUser },
      panelClass: 'dialogPanel',
      maxWidth: '95vw',
      width: '666px',
    });

    this._subscription.add(
      this.commentDialogRef
        .beforeClosed()
        .pipe(
          tap((result: { actionType: string, data: string }) => {
            if (!result) return;
            if (result.actionType === 'EDIT') {
              const dto = <EditCommentDto>{ commentId: comment._id, text: result?.data };
              this._store.dispatch(EditComment({ dto }));
            }
          })
        )
        .subscribe()
    );
  }

  onContextMenuDeleteAction(comment: PostComment) {
    this.deleteDialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: { message: 'Delete this comment ?' },
      width: '666px',
      panelClass: 'dialogPanel',
    });

    this._subscription.add(
      this.deleteDialogRef
        .beforeClosed()
        .pipe(
          tap((confirmed) => {
            if (confirmed) {
              this._store.dispatch(DeleteComment({ commentId: comment._id }));
            }
          })
        )
        .subscribe()
    );
  }

  openReactionDialog(commentId: string) {
    this.reactionsDialogRef = this._dialog.open(ReactionsDialogComponent, {
      width: '666px',
      panelClass: 'dialogPanel',
    });

    const reactAndCloseDialog$ = this.reactionsDialogRef.beforeClosed().pipe(
      tap((variant: string) => {
        const dto = <CommentReaction>{
          commentId,
          variant,
          reactedBy: this.authUser,
        };
        this._store.dispatch(ReactComment({ dto }));
      })
    );

    this._subscription.add(reactAndCloseDialog$.subscribe());
  }

  clickComment(commentId: string) {
    alert('TODO:// replyToComment(commentId: string)');
  }

  viewCommentReactions(commentId: string) {
    alert('TODO:// View Comment Reactions');
  }

  onClickViewReplies(commentId: string) {
    this.clickViewReplies.emit(commentId);
    // navigate to comment detail and it's replies
  }

  getCommentClass(authorUsername: string): string {
    return compareToGetClass(this.authUser.username, authorUsername);
  }
}
