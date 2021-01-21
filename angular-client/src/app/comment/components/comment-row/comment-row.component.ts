import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

@Component({
  selector: 'nsg-comment-row',
  templateUrl: './comment-row.component.html',
  styleUrls: ['./comment-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentRowComponent {

  @Input() comment: Comment;
  @Input() bgClass: string = "comment__box";
  @Output() onUsernameClicked = new EventEmitter<string>();
  @Output() onReactClicked = new EventEmitter<string>();
  @Output() onReplyClicked = new EventEmitter<string>();
  @Output() onReactionsCountClicked = new EventEmitter<string>();

  public clickUsername(username: string): void {
    this.onUsernameClicked.emit(username);
  }

  public clickReact(commentId: string): void {
    this.onReactClicked.emit(commentId);
  }

  public clickReply(commentId: string): void {
    this.onReplyClicked.emit(commentId);
  }

  public clickReactionsCount(commentId: string): void {
    this.onReactionsCountClicked.emit(commentId);
  }

}
