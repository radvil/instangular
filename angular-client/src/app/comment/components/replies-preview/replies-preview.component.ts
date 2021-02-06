import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-replies-preview',
  templateUrl: './replies-preview.component.html',
  styleUrls: ['./replies-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepliesPreviewComponent {

  @Input() commentId: string;
  @Input() replies: Comment[];
  @Input() repliesCount: number;
  @Output() clickViewReplies = new EventEmitter<string>();

  onClickViewReplies(): void {
    if (this.commentId) {
      this.clickViewReplies.emit(this.commentId);
    }
  }

}
