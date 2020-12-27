import { Component, Input } from '@angular/core';

export interface StoryUser {
  username: string;
  photo: string;
}

export interface StoryWithUser {
  user: StoryUser;
  storyIds: string[];
}

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent {

  @Input() user: StoryUser;
  @Input() storyIds: number[] = [];
  @Input() enableAddIcon: boolean = false;

  constructor() {
  }
}
