import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reactions-dialog',
  styleUrls: ['./reactions-dialog.component.scss'],
  template: `
    <h3 class="title">Choose reaction</h3>
    <ul class="reactionsList">
      <li *ngFor="let reaction of reactionsList" (click)="confirmReaction(reaction.key)">
        <img [src]="reaction.icon" />
        <small>{{ reaction.label }}</small>
      </li>
    </ul>
  `,
})
export class ReactionsDialogComponent {
  isLoading: boolean;
  reactionsList = [
    { key: 'like', label: 'Like', icon: 'assets/icons/like.svg' },
    { key: 'love', label: 'Love', icon: 'assets/icons/love.svg' },
    { key: 'haha', label: 'Haha', icon: 'assets/icons/haha.svg' },
    { key: 'huhu', label: 'Huhu', icon: 'assets/icons/huhu.svg' },
    { key: 'angry', label: 'Angry', icon: 'assets/icons/angry.svg' },
    { key: 'care', label: 'Care', icon: 'assets/icons/care.svg' },
  ]

  constructor(
    public dialogRef: MatDialogRef<ReactionsDialogComponent>,
  ) {
    this.isLoading = false;
  }

  confirmReaction(reactionKey: string): void {
    this.isLoading = true;
    this.dialogRef.close(reactionKey);
  }

  cancelAction(): void {
    this.dialogRef.close(null);
  }
}
