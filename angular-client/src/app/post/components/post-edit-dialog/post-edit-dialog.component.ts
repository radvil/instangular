import {
  ChangeDetectionStrategy,
  Component,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdatePostDto, Post } from 'src/app/post/interfaces';


@Component({
  selector: 'app-post-edit-dialog',
  templateUrl: './post-edit-dialog.component.html',
  styleUrls: ['./post-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostEditDialogComponent {
  public descriptionText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currentPost: Post },
    public _dialogRef: MatDialogRef<PostEditDialogComponent>,
  ) {
    if (this.data) {
      this.descriptionText = this.data.currentPost.description;
    }
  }

  public toggleReadMore() {
    // TODO: // Truncate //
    // this._truncateText.transform(this.data.currentPost.description)
  }

  public submitUpdate(): void {
    if (this.data) {
      this._dialogRef.close(<UpdatePostDto>{
        description: this.descriptionText
      });
    }
  }

  public cancelUpdate(): void {
    this._dialogRef.close();
  }
}
