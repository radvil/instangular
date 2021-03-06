import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  styleUrls: ['./confirm-dialog.component.scss'],
  template: `
    <ng-container *ngIf="!isLoading; else placeholder">
      <h3 class="message">{{ messageText }}</h3>
      <br />
      <div class="fx-row">
        <button mat-raised-button (click)="onConfirmClicked()">
          {{ confirmText }}
        </button>
        <button (click)="onCancelClicked()">
          {{ cancelText }}
        </button>
      </div>
    </ng-container>
    <ng-template #placeholder>
      <h3 class="message">Loading...</h3>
    </ng-template>
  `,
})
export class ConfirmDialogComponent {
  messageText = 'Delete ';
  confirmText = 'Yes';
  cancelText = 'No';
  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {
    this.isLoading = false;
    if (this.data.message) {
      this.messageText = this.data.message;
    }
  }

  onConfirmClicked(): void {
    this.isLoading = true;
    this.dialogRef.close(true);
  }

  onCancelClicked(): void {
    this.dialogRef.close(null);
  }
}
