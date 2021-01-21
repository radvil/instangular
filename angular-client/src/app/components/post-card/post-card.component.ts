import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';
import { Post } from 'src/app/post';

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
    this._subscription.add(this.updateDialogRef.afterClosed().subscribe(
      submitted => {
        if (submitted) {
          this._snackBar.open('Post Updated', 'See Post');
          // TODO: Make click action on see post snackbar
        }
      }
    ))
  }

}
