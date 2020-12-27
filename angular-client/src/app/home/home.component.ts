import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { User } from '../user';
import { Post } from '../post';
import { PostState } from '../post/store/post.state';
import { GetPosts } from '../post/store/post.actions';
import { $_posts } from '../post/store/post.selectors';
import { AuthState } from '../auth/store/auth.model';
import { $_authUser } from '../auth/store/auth.selectors';
import { StoryWithUser, StoryUser } from './story/story.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public authUser$: Observable<User>;
  public stories: StoryWithUser[];
  public posts$: Observable<Post[]>;

  constructor(
    private store: Store<PostState | AuthState>
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getStories();
    this.getFeeds();
  }

  private getCurrentUser(): void {
    this.authUser$ = this.store.select($_authUser);
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
    this.store.dispatch(GetPosts());
    this.posts$ = this.store.select($_posts);
  }

}
