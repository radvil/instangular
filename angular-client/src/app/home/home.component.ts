import { Component, OnInit } from '@angular/core';
import { StoryWithUser, StoryUser } from './story/story.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  get firstStoryItem(): StoryUser {
    if (this.authUser) {
      const isSelf = this.authUser.username === 'Laravel' ? 'Your Story' : 'Laravel';
      return {
        username: isSelf,
        profilePicture: this.authUser.profilePicture,
      }
    }
  }

  public authUser: StoryUser = {
    username: "Laravel",
    profilePicture: "assets/images/portrait.jpg",
  };
  public stories: StoryWithUser[] = [
    {
      user: {
        username: "Daryl Dickson",
        profilePicture: "assets/images/portrait.jpg",
      },
      storyIds: ["1", "2", "3", "4"],
    },
    {
      user: {
        username: "Rick",
        profilePicture: "assets/images/portrait.jpg",
      },
      storyIds: ["1", "2", "3", "4"],
    },
    {
      user: {
        username: "Maggie",
        profilePicture: "assets/images/portrait.jpg",
      },
      storyIds: ["1", "2", "3", "4"],
    },
    {
      user: {
        username: "Carol",
        profilePicture: "assets/images/portrait.jpg",
      },
      storyIds: ["1", "2", "3", "4"],
    },
    {
      user: {
        username: "Carl",
        profilePicture: "assets/images/portrait.jpg",
      },
      storyIds: ["1", "2", "3", "4"],
    },
  ];

  constructor() {
  }

}
