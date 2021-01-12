import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {

  public defaultPortrait = "assets/images/portrait.jpg";
  public errorImagePath = "assets/images/portrait.jpg";
  @Input() post: Post;
  @Output() onUserProfileClicked = new EventEmitter<string>();

  public viewUserProfile(username: string) {
    this.onUserProfileClicked.emit(username);
  }

  public get showedReactionUsername(): string {
    if (this.post.reactions.length > 0) {
      return this.post.reactions[0].reactedBy.username;
    } else {
      return null;
    }
  }

  public get reactionsCount(): number {
    return this.post.reactionsCount
  }

}
