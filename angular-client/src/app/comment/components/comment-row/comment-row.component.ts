import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UserBasic } from 'src/app/user/interfaces';

@Component({
  selector: 'app-comment-row',
  templateUrl: './comment-row.component.html',
  styleUrls: ['./comment-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentRowComponent {

  @Input() comment: Comment;
  @Input() bgClass: string = "comment__box";
  @Output() clickReact = new EventEmitter<string>();
  @Output() clickReply = new EventEmitter<string>();
  @Output() clickReactionsCount = new EventEmitter<string>();

  constructor(private _router: Router) {}

  public showUser(user: UserBasic): void {
    this._router.navigate(['user', user.username]);
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
