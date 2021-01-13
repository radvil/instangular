import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { $_post, $_postError, $_postLoading } from '../store/post.selectors';
import { $_commentsByPostId, Comment, CreateCommentDto } from 'src/app/comment';
import { GetPostById } from '../store/post.actions';
import { AddComment } from 'src/app/comment/store/comment.actions';
import { User } from 'src/app/user';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit, OnDestroy {

  private _subscription = new Subscription();
  public isLoading$: Observable<boolean>;
  public httpError$: Observable<Error>;

  public authUser$: Observable<User>;
  public post$: Observable<Post>;
  public comments$: Observable<Comment[]>;

  private initValues(): void {
    this._subscription.add(
      this._route.paramMap
        .pipe(map(param => param.get('postId')))
        .subscribe(postId => {
          this._store.dispatch(GetPostById({ postId }));
        })
    );

    this.authUser$ = this._store.select($_authUser);
    this.post$ = this._store.select($_post)
    this.comments$ = this._store.select($_commentsByPostId).pipe(
      filter(comments => !!comments.length)
    );
    this.isLoading$ = this._store.select($_postLoading);
    this.httpError$ = this._store.select($_postError);
  }

  public viewPreviousComments(postIdEvent: string) {
    alert('View prev comments' + postIdEvent);
  }

  public viewUserProfile(usernameEvent: string) {
    this._router.navigate(['user', usernameEvent]);
  }

  public addComment(commentEvent: CreateCommentDto) {
    this._store.dispatch(AddComment({ createCommentDto: commentEvent }));
  }

  public showOptions(): void {
    alert('Showing comments options');
  }

  constructor(
    private _store: Store,
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
