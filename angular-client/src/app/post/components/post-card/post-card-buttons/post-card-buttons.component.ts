import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostReaction } from 'src/app/post/interfaces';

@Component({
  selector: 'nsg-post-card-buttons',
  templateUrl: './post-card-buttons.component.html',
  styleUrls: ['./post-card-buttons.component.scss']
})
export class PostCardButtonsComponent {

  @Input() postId: string;
  @Input() myReaction: PostReaction = null;
  @Output() onReactClicked = new EventEmitter<string>();
  @Output() onCommentClicked = new EventEmitter<string>();
  @Output() onShareClicked = new EventEmitter<string>();
  @Output() onSaveClicked = new EventEmitter<string>();

  clickReactIcon(postId: string) {
    this.onReactClicked.emit(postId);
  }

  clickCommentIcon(postId: string) {
    this.onCommentClicked.emit(postId);
  }

  clickShareIcon(postId: string) {
    this.onShareClicked.emit(postId);
  }

  clickSaveIcon(postId: string) {
    this.onSaveClicked.emit(postId);
  }
}
