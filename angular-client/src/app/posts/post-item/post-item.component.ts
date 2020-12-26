import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {

  public defaultPortrait = "assets/images/portrait.jpg";
  public errorImagePath = "assets/images/portrait.jpg";
  @Input() post = {} as Post;

}
