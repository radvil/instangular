import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {

  @Input() comment: Comment;
  @Input() bgClass: string;
  @Output() onUsernameClicked = new EventEmitter<string>();
  @Output() onReactClicked = new EventEmitter<string>();
  @Output() onReplyClicked = new EventEmitter<string>();
  @Output() onReactionsCountClicked = new EventEmitter<string>();
  @Output() onViewRepliesClicked = new EventEmitter<string>();

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

  public clickViewReplies(commentId: string): void {
    this.onViewRepliesClicked.emit(commentId);
  }

}
