import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { CreateCommentDto } from 'src/app/comment/interfaces';
import { AddComment } from 'src/app/comment/store/actions';
import { PostEditDialogComponent } from 'src/app/post/components';
import { CreatePostDto, Post } from 'src/app/post/interfaces';
import { GetPosts, UpdatePostById } from 'src/app/post/store/post.actions';
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
    this.posts$ = this._store.select($_posts);
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

  openEditDialog(postId: string, currentPost: Post): void {
    this.updateDialogRef = this._dialog.open(PostEditDialogComponent, {
      width: '333px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'updatePostDialog',
      data: { postId, currentPost }
    });
    const doAfterClose$ = this.updateDialogRef
      .afterClosed()
      .pipe(tap((dto: CreatePostDto) => {
        if (dto) {
          let changes = { description: dto.description };
          this._store.dispatch(UpdatePostById({ postId, changes }));
          this._snackBar.open('Post Updated', 'See Post');
        }
      }))
    this._subscription.add(doAfterClose$.subscribe());
  }

  openDeleteDialog(postIdEvent: string): void {
    alert('TODO:// openDeleteDialog(postId) ' + postIdEvent);
  }

  public commentToPost(commentText: string, postId: string) {
    const createCommentDto = <CreateCommentDto>{
      postId: postId,
      text: commentText,
      commentedBy: this.authUser._id,
    }
    this._store.dispatch(AddComment({ createCommentDto }));
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getStories();
    this.getFeeds();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _store: Store<PostState>,
  ) { }

}
