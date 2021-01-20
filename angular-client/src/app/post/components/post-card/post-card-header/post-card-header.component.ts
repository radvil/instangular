import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from 'src/app/post';
import { UserBasic } from 'src/app/user';

@Component({
  selector: 'app-post-card-header',
  templateUrl: './post-card-header.component.html',
  styleUrls: ['./post-card-header.component.scss'],
})
export class PostCardHeaderComponent {
  @Input() post: Post;
  @Input() enableEdit = true;
  @Input() enableDelete = true;
  @Output() clickUser = new EventEmitter<UserBasic>();
  @Output() onMenuEditClicked = new EventEmitter<string>();
  @Output() onMenuDeleteClicked = new EventEmitter<string>();

  onClickUser(user: UserBasic): void {
    this.clickUser.emit(user);
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
