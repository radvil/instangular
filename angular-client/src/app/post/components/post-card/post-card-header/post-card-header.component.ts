import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from 'src/app/post';

@Component({
  selector: 'nsg-post-card-header',
  templateUrl: './post-card-header.component.html',
  styleUrls: ['./post-card-header.component.scss'],
})
export class PostCardHeaderComponent {

  @Input() post: Post;
  @Input() enableEdit = true;
  @Input() enableDelete = true;
  @Output() onUsernameClicked = new EventEmitter<string>();
  @Output() onMenuEditClicked = new EventEmitter<string>();
  @Output() onMenuDeleteClicked = new EventEmitter<string>();

  clickUsername(username: string): void {
    this.onUsernameClicked.emit(username);
  }

  clickMenuEdit(postId: string): void {
    if (this.enableEdit) {
      this.onMenuEditClicked.emit(postId);
    }
  }

  clickMenuDelete(postId: string): void {
    if (this.enableDelete) {
      this.onMenuDeleteClicked.emit(postId);
    }
  }
  

}
