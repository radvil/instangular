import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/store/auth.model';
import { $_authUser } from 'src/app/auth/store/auth.selectors';

import { $_commentError, $_commentLoading, $_commentsOfPost, Comment } from 'src/app/comment';
import { GetComments } from 'src/app/comment/store/comment.actions';
import { CommentState } from 'src/app/comment/store/comment.state';
import { User } from 'src/app/user';
import { Post } from '../post.interface';
import { GetPostById } from '../store/post.actions';
import { $_post } from '../store/post.selectors';
import { PostState } from '../store/post.state';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit, OnDestroy {

  private _subscription = new Subscription();
  public authUser: User;
  public post$: Observable<Post>;
  public comments: Comment[];
  public isLoading$: Observable<boolean>;
  public httpError$: Observable<Error>;
  public postId$: Observable<string>;

  private initValues(): void {
    this.isLoading$ = this._store.select($_commentLoading);
    this.httpError$ = this._store.select($_commentError);

    this.postId$ = this._route.paramMap.pipe(
      map(param => param.get('postId')),
      tap(postId => {
        this._store.dispatch(GetPostById({ postId }));
        this._store.dispatch(GetComments({ postId }))
      }),
    );
    this._subscription.add(
      this._store.select($_authUser).subscribe(user => this.authUser = user)
    );
    this.post$=  this.postId$
      .pipe(switchMap(() => this._store.select($_post)), filter(post => !!post))
    this._subscription.add(
      this._store.select($_commentsOfPost).subscribe(comments => this.comments = comments)
    );
  }

  public viewPreviousComments(postIdEvent: string) {
    alert('View prev comments' + postIdEvent);
  }

  public viewUserProfile(usernameEvent: string) {
    this._router.navigate(['user', usernameEvent]);
  }

  public addComment(postIdEvent: string) {
    alert('TODO:// Add new comment. postId = ' + postIdEvent);
  }

  public showOptions(): void {
    alert('Showing comments options');
  }

  constructor(
    private _store: Store<CommentState | PostState | AuthState>,
    private _route: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
