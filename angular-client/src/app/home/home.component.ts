import { Component, OnInit } from '@angular/core';
import { Post } from '../posts';
import { User } from '../users';
import { authUser } from '../auth'
import { StoryWithUser, StoryUser } from './story/story.component';
import { Store } from '@ngrx/store';
import { PostState } from '../posts/store/post.state';
import { GetPosts } from '../posts/store/post.actions';
import { Observable } from 'rxjs';
import { $_posts } from '../posts/store/post.selectors';

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
  public posts: Observable<Post[]>;

  constructor(
    private store: Store<PostState>
  ) { }

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
    this.store.dispatch(GetPosts());
    this.posts = this.store.select($_posts);
    // this.posts = [
    //   {
    //     _id: '1234',
    //     description: 'This is a new post test',
    //     author: {
    //       _id: "authorId122",
    //       username: "author122",
    //       profilePicture: "assets/images/portrait.jpg"
    //     },
    //     image: "assets/images/post.jpeg",
    //     createdAt: new Date().toISOString()
    //   },
    //   {
    //     _id: '2345',
    //     description: 'Pandora Live Concert ❤ thank you for watching!',
    //     author: {
    //       _id: "userId1234",
    //       username: "dualipa",
    //       profilePicture: "assets/images/portrait.jpg"
    //     },
    //     image: "assets/images/post.jpeg",
    //     createdAt: new Date().toISOString()
    //   },
    // ]
  }

}
