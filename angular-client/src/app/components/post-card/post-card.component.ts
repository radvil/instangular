import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CreatePostDto, Post } from 'src/app/post';
import { UpdatePostById } from 'src/app/post/store/post.actions';
import { PostState } from 'src/app/post/store/post.state';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent implements OnDestroy {
  @Input() post: Post;
  @Output() onUserProfileClicked = new EventEmitter<string>();
  private _subscription = new Subscription();
  public updateDialogRef: MatDialogRef<PostEditDialogComponent>;

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _store: Store<PostState>,
  ) { }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
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

  public openUpdatePostDialog(postIdEvent: string) {
    this.updateDialogRef = this._dialog.open(PostEditDialogComponent, {
      width: '333px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'updatePostDialog',
      data: { postId: postIdEvent, currentPost: this.post }
    });
    this._subscription.add(
      this.updateDialogRef
        .afterClosed()
        .subscribe((dto: CreatePostDto) => {
          if (dto) {
            this._store.dispatch(
              UpdatePostById({
                postId: this.post._id,
                changes: { description: dto.description },
              })
            );
            this._snackBar.open('Post Updated', 'See Post');
          }
        })
    );
  }

}
