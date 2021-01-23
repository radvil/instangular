import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Post } from 'src/app/post';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent {
  @Input() post: Post;
  @Output() onUserProfileClicked = new EventEmitter<string>();
  @Output() onEditSelected = new EventEmitter<string>();
  @Output() onDeleteSelected = new EventEmitter<string>();

  public get showedReactionUsername(): string {
    if (this.post.reactions.length > 0) {
      return this.post.reactions[0].reactedBy.username;
    } else {
      return null;
    }
  }

  public get reactionsCount(): number {
    return this.post.reactionsCount;
  }

  viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  selectMenuEdit(postIdEvent: string) {
    this.onEditSelected.emit(postIdEvent);
  }

  selectMenuDelete(postIdEvent: string) {
    this.onDeleteSelected.emit(postIdEvent);
  }

  clickReact(postId: string) {
    console.log('PLEASE REWORK THOSE INPUTS OUPUTS')
    alert('TODO:// openReactionsDialog(postId)');
  }

  clickComment(postId: string) {
    alert('TODO:// emit to home component for comment dialog input');
  }

  clickShare(postId: string) {
    alert('TODO:// openShareOptions(postId)');
  }

  clickSave(postId: string) {
    alert('TODO:// openSaveOptions(postId)');
  }

}
