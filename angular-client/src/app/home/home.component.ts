import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { $_authUser } from '../auth/store/auth.selectors';
import { $_posts, $_postsWithLastTwoComments } from '../post/store/post.selectors';
import { GetPosts } from '../post/store/post.actions';
import { StoryWithUser } from './story/story.component';
import { User } from '../user';
import { Post } from '../post';
import { Comment } from '../comment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public authUser: User;
  public stories: StoryWithUser[];
  public posts$: Observable<Post[]>;
  public defaultPortrait = "assets/images/portrait.jpg";
  public errorImagePath = "assets/images/portrait.jpg";

  private getCurrentUser(): void {
    this._store
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
    this._store.dispatch(GetPosts());
    this.posts$ = this._store.select($_postsWithLastTwoComments);
  }

  public checkSelfUser(storyUsername: string): boolean {
    return this.authUser.username == storyUsername;
  }

  public checkIfHasStoriesActive(storyIds: string): boolean {
    return storyIds && (storyIds.length && storyIds.length > 0);
  }

  public viewPostComments(postIdEvent: string) {
    this._router.navigate(['post', postIdEvent]);
  }

  public viewUserProfile(usernameEvent: string) {
    this._router.navigate(['user', usernameEvent]);
  }

  public showMessages(): void {
    alert('TODO:// Showing user messages');
  }

  public addComment(postIdEvent: string) {
    alert('TODO:// Add new comment. postId = ' + postIdEvent);
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getStories();
    this.getFeeds();
  }

  constructor(
    private _store: Store,
    private _router: Router,
  ) { }

}
