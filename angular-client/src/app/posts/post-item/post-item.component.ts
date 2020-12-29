import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post, PostReaction } from '../post.interface';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {

  public defaultPortrait = "assets/images/portrait.jpg";
  public errorImagePath = "assets/images/portrait.jpg";
  @Input() post: Post;

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
