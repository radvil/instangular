import { Component, OnInit } from '@angular/core';
import { Post } from '../posts';
import { authUser, User } from '../users';
import { StoryWithUser, StoryUser } from './story/story.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  get firstStoryItem(): StoryUser {
    if (this.authUser) {
      const isSelf = this.authUser.username === 'victoriaelizabeth' ? 'Your Story' : 'victoriaelizabeth';
      return {
        username: isSelf,
        profilePicture: this.authUser.profilePicture,
      }
    }
  }

  public authUser: User;
  public stories: StoryWithUser[];
  public posts: Post[];

  constructor() {
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getStories();
    this.getFeeds();
  }

  private getCurrentUser(): void {
    this.authUser = authUser;
  }

  private getStories(): void {
    this.stories = [
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
  }

  private getFeeds(): void {
    this.posts = [
      {
        _id: '1234',
        description: 'This is a new post test',
        author: {
          _id: "authorId122",
          username: "author122",
          profilePicture: "assets/images/portrait.jpg"
        },
        image: "assets/images/post.jpeg",
        createdAt: new Date().toISOString()
      },
      {
        _id: '2345',
        description: 'Pandora Live Concert ❤ thank you for watching!',
        author: {
          _id: "userId1234",
          username: "dualipa",
          profilePicture: "assets/images/portrait.jpg"
        },
        image: "assets/images/post.jpeg",
        createdAt: new Date().toISOString()
      },
    ]
  }

}
