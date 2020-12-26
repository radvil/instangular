import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { User } from '../user';
import { authUser } from '../auth'
import { StoryWithUser, StoryUser } from './story/story.component';
import { Store } from '@ngrx/store';
import { PostState } from '../post/store/post.state';
import { ApiGetPosts } from '../post/store/post.actions';
import { Observable } from 'rxjs';
import { $_posts } from '../post/store/post.selectors';

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
        photo: this.authUser.photo,
      }
    }
  }

  public authUser: User;
  public stories: StoryWithUser[];
  public posts$: Observable<Post[]>;

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
          username: "maggie",
          photo: "assets/images/portrait.jpg",
        },
        storyIds: ["1", "2", "3", "4"],
      },
      {
        user: {
          username: "rickgrymes",
          photo: "assets/images/portrait.jpg",
        },
        storyIds: ["1", "2", "3", "4"],
      },
      {
        user: {
          username: "daryldickson",
          photo: "assets/images/portrait.jpg",
        },
        storyIds: ["1", "2", "3", "4"],
      },
      {
        user: {
          username: "carol",
          photo: "assets/images/portrait.jpg",
        },
        storyIds: ["1", "2", "3", "4"],
      },
      {
        user: {
          username: "carl",
          photo: "assets/images/portrait.jpg",
        },
        storyIds: ["1", "2", "3", "4"],
      },
    ];
  }

  private getFeeds(): void {
    this.store.dispatch(ApiGetPosts());
    this.posts$ = this.store.select($_posts);
  }

}
