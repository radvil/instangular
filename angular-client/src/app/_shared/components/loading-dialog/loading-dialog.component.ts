import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  styleUrls: ['./loading-dialog.component.scss'],
  template: `
    <div class="loading__dialog">
      <ng-container *ngIf="isLoading; else closeButton">
        <div class="spinner">
          <h2>Uploading...</h2>
          <mat-progress-spinner></mat-progress-spinner>
        </div>
      </ng-container>
      <ng-template #closeButton>
        <div class="statusIcon">✔️</div>
        <button (click)="close()" mat-flat-button color="accent">done</button>
      </ng-template>
    </div>
  `,
})
export class LoadingDialogComponent {
  public isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    public dialogRef: MatDialogRef<LoadingDialogComponent>,
  ) { }

  close(): void {
    this.dialogRef.close(true);
  }

  // To be invoked from another instance
  public setLoading(value: boolean) {
    this.isLoading = value;
  }
}
