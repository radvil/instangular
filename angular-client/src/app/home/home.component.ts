import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from '../user';
import { Post } from '../post';
import { $_authUser } from '../auth/store/auth.selectors';
import { AuthState } from '../auth/store/auth.model';
import { PostState } from '../post/store/post.state';
import { GetPosts } from '../post/store/post.actions';
import { $_posts } from '../post/store/post.selectors';
import { StoryWithUser } from './story/story.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public authUser: User;
  public stories: StoryWithUser[];
  public posts$: Observable<Post[]>;

  private getCurrentUser(): void {
    this.store
      .select($_authUser)
      .pipe(filter(user => user !== null))
      .subscribe(user => this.authUser = user);
  }

  private getStories(): void {
    if (this.authUser) {
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
      this.stories.unshift({
        user: {
          username: this.authUser.username,
          photo: this.authUser.photo,
        },
        storyIds: [],
      })
    }
  }

  private getFeeds(): void {
    this.store.dispatch(GetPosts());
    this.posts$ = this.store.select($_posts);
  }

  public checkSelfUser(storyUsername: string): boolean {
    return this.authUser.username == storyUsername;
  }

  public checkIfHasStoriesActive(storyIds: string): boolean {
    return storyIds && (storyIds.length && storyIds.length > 0);
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getStories();
    this.getFeeds();
  }

  constructor(
    private store: Store<PostState | AuthState>
  ) { }

}
