import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { PostEditDialogComponent } from 'src/app/post/components';
import { Post } from 'src/app/post/interfaces';
import { GetPosts } from 'src/app/post/store/post.actions';
import { $_posts } from 'src/app/post/store/post.selectors';
import { PostState } from 'src/app/post/store/post.state';
import { User } from 'src/app/user';
import { StoryWithUser } from '../components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private _subscription = new Subscription();
  public updateDialogRef: MatDialogRef<PostEditDialogComponent>;
  public authUser: User;
  public stories: StoryWithUser[];
  public posts: Post[];
  public defaultPortrait = "assets/images/portrait.jpg";
  public errorImagePath = "assets/images/portrait.jpg";

  private getAuthUser(): void {
    const authUser$ = this._store.select($_authUser);
    this._subscription.add(authUser$.subscribe(user => this.authUser = user));
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
    this._subscription.add(
      this._store.select($_posts).subscribe(posts => this.posts = posts)
    );
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

  ngOnInit(): void {
    this.getAuthUser();
    this.getStories();
    this.getFeeds();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  constructor(
    private _router: Router,
    private _store: Store<PostState>,
  ) { }

}
