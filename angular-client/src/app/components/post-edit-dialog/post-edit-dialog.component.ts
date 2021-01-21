import {
  ChangeDetectionStrategy,
  Component,
  Inject,
} from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post } from 'src/app/post';
import { UpdatePostById } from 'src/app/post/store/post.actions';
import { $_postLoading } from 'src/app/post/store/post.selectors';
import { PostState } from 'src/app/post/store/post.state';
import { TruncatePipe } from 'src/app/utils';

@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['./post-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditDialogComponent {
  public descriptionText: string;
  public isPostLoading$: Observable<boolean>;
  private _truncateText = new TruncatePipe();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { postId: string; currentPost: Post },
    public _dialogRef: MatDialogRef<PostEditDialogComponent>,
    private _store: Store<PostState>,
  ) {
    if (this.data) {
      this.descriptionText = this.data.currentPost.description;
      this.isPostLoading$ = this._store.select($_postLoading);
    }
  }

  public toggleReadMore() {
    // TODO: // Truncate //
    // this._truncateText.transform(this.data.currentPost.description)
  }

  public submitUpdate(): void {
    if (this.data.postId) {
      this._store.dispatch(
        UpdatePostById({
          postId: this.data.postId,
          changes: { description: this.descriptionText },
        })
      );
      this._dialogRef.close(true);
    }
  }

  public cancelUpdate(): void {
    this._dialogRef.close();
  }
}
