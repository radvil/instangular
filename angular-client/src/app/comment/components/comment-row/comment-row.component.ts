import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-comment-row',
  templateUrl: './comment-row.component.html',
  styleUrls: ['./comment-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentRowComponent {

  @Input() comment: Comment;
  @Input() bgClass: string = "comment__box";
  @Output() clickUsername = new EventEmitter<string>();
  @Output() clickReact = new EventEmitter<string>();
  @Output() clickReply = new EventEmitter<string>();
  @Output() clickReactionsCount = new EventEmitter<string>();

  public onClickUsername(username: string): void {
    this.clickUsername.emit(username);
  }

  public onClickReact(commentId: string): void {
    this.clickReact.emit(commentId);
  }

  public onClickReply(commentId: string): void {
    this.clickReply.emit(commentId);
  }

  public onClickReactionsCount(commentId: string): void {
    this.clickReactionsCount.emit(commentId);
  }

}
