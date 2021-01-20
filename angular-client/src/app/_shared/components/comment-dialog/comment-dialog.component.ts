import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/user/interfaces';
import { PostComment } from 'src/app/comment/interfaces'

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent {
  public user: User;
  public comment: PostComment;
  public actionType = "ADD";
  public commentText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { comment: PostComment, authUser: User },
    public dialogRef: MatDialogRef<CommentDialogComponent>,
  ) {
    if (this.data.comment) {
      this.actionType = "EDIT";
      this.comment = this.data.comment;
      this.commentText = this.comment.text;
    }
    if (this.data.authUser) {
      this.user = this.data.authUser;
    }
  }

  submit(): void {
    this.dialogRef.close({
      actionType: this.actionType,
      data: this.commentText
    });
  }

}
