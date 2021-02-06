import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  CommentDialogComponent,
  ConfirmDialogComponent,
  ReactionsDialogComponent,
} from 'src/app/_shared/components';
import { AddComment } from 'src/app/comment/store/comment.actions';
import { UpdatePostDto, Post, PostReaction } from 'src/app/post/interfaces';
import { User, UserBasic } from 'src/app/user/interfaces';
import { CreatePostCommentDto } from 'src/app/comment/interfaces';
import {
  DeletePostById,
  ReactPost,
  UpdatePostById,
} from '../../store/post.actions';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent implements OnDestroy {
  @Input() post: Post;
  @Input() authUser: User;
  @Input() textInputClass: string = null;
  @Output() onCommentClicked = new EventEmitter<string>();

  public updateDialogRef: MatDialogRef<PostEditDialogComponent>;
  public deleteDialogRef: MatDialogRef<ConfirmDialogComponent>;
  public reactionsDialogRef: MatDialogRef<ReactionsDialogComponent>;
  public commentDialogRef: MatDialogRef<CommentDialogComponent>;
  private _subscription = new Subscription();

  get sameAsAuthor(): boolean {
    return this.authUser?._id === this.post?.postedBy?._id;
  }

  get reactionText(): string {
    if (this.post.reactions?.length) {
      let usernames = this.post.reactions.map(reaction => reaction.reactedBy.username);
      // TODO: change to switchCase
      if (usernames.length > 2) {
        return `${usernames.slice(0, 2).toString()}, and ${this.post.reactionsCount - 2} others`;
      } else if (usernames.length === 2) {
        return `${usernames[0]} and ${usernames[1]}`;
      } else if (usernames.length === 1) {
        return `${usernames.toString()}`;
      } else {
        const lastUsername = usernames.pop();
        return `${usernames.toString()}, and ${lastUsername}`;
      }
    }
  }

  constructor(
    private _dialog: MatDialog,
    private _store: Store,
    private _router: Router
  ) { }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public get showedReactionUsername(): string {
    if (this.post.reactions.length > 0) {
      return this.post.reactions[0].reactedBy.username;
    } else {
      return null;
    }
  }

  public get reactionsCount(): number {
    return this.post.reactionsCount;
  }

  showUser(event: UserBasic) {
    this._router.navigate(['user', event.username]);
  }

  openUpdatePostDialog(postIdEvent: string) {
    this.updateDialogRef = this._dialog.open(PostEditDialogComponent, {
      width: '333px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'updatePostPanel',
      data: { postId: postIdEvent, currentPost: this.post },
    });

    const updateAndCloseDialog$ = this.updateDialogRef.beforeClosed().pipe(
      tap((dto: UpdatePostDto) => {
        if (dto) {
          let changes = { description: dto.description };
          this._store.dispatch(
            UpdatePostById({ postId: postIdEvent, changes })
          );
        }
      })
    );

    this._subscription.add(updateAndCloseDialog$.subscribe());
  }

  openDeletePostDialog(postIdEvent: string) {
    this.deleteDialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '333px',
      panelClass: 'dialogPanel',
      data: { message: 'Delete this post ?' },
    });

    const deleteAndCloseDialog$ = this.deleteDialogRef.beforeClosed().pipe(
      tap((confirmed) => {
        if (confirmed) {
          this._store.dispatch(DeletePostById({ postId: postIdEvent }));
        }
      })
    );

    this._subscription.add(deleteAndCloseDialog$.subscribe());
  }

  openReactionsDialog(postIdEvent: string) {
    this.reactionsDialogRef = this._dialog.open(ReactionsDialogComponent, {
      width: '666px',
      panelClass: 'dialogPanel',
    });

    const reactAndCloseDialog$ = this.reactionsDialogRef.beforeClosed().pipe(
      tap((variant: string) => {
        const dto = <PostReaction>{
          postId: postIdEvent,
          variant,
          reactedBy: this.authUser,
        };
        this._store.dispatch(ReactPost({ dto }));
      })
    );

    this._subscription.add(reactAndCloseDialog$.subscribe());
  }

  clickComment(postId: string) {
    this.commentDialogRef = this._dialog.open(CommentDialogComponent, {
      data: { authUser: this.authUser },
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
            if (result.actionType === 'ADD' && result.data) {
              const dto = <CreatePostCommentDto>{
                postId: postId,
                text: result.data,
              };
              this._store.dispatch(AddComment({ dto }));
            }
          })
        )
        .subscribe()
    );
  }

  clickShare(postId: string) {
    alert('TODO:// openShareOptions(postId)');
  }

  clickSave(postId: string) {
    alert('TODO:// openSaveOptions(postId)');
  }

  commentToPost(text: string, commentedBy: string) {
    if (text && this.post._id) {
      const createCommentDto = <CreatePostCommentDto>{
        postId: this.post._id,
        text: text,
        commentedBy,
      };
      this._store.dispatch(AddComment({ dto: createCommentDto }));
    }
  }
}
