import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface StoryUser {
  username: string;
  photo: string;
}

export interface StoryWithUser {
  user: StoryUser;
  storyIds: string[];
}

@Component({
  selector: 'isg-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryComponent {

  @Input() user: StoryUser;
  @Input() storyIds: number[];
  @Input() enableIcon: boolean;
  @Input() enableBorder: boolean;

  constructor() {
  }
}
