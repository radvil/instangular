import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { $_post, $_postError, $_postLoading } from '../store/post.selectors';
import { $_commentLoading, $_commentsByPostId, Comment, CreateCommentDto, GetCommentsByPostIdDto } from 'src/app/comment';
import { GetPostById } from '../store/post.actions';
import { AddComment, GetCommentsByPostId } from 'src/app/comment/store/comment.actions';
import { User } from 'src/app/user';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit, OnDestroy {

  private pageNumber = 1;
  private _subscription = new Subscription();
  public isPostLoading$: Observable<boolean>;
  public isPostHttpError$: Observable<Error>;
  public isCommentsLoading$: Observable<boolean>;

  public authUser$: Observable<User>;
  public post$: Observable<Post>;
  public comments$: Observable<Comment[]>;

  private initValues(): void {
    this._subscription.add(
      this._route.paramMap
        .pipe(
          map(param => param.get('postId')),
          tap(postId => {
            this._store.dispatch(GetPostById({ postId }));
            this.pageNumber += 1;
          })
        )
        .subscribe()
    );

    this.authUser$ = this._store.select($_authUser);
    this.post$ = this._store.select($_post);
    this.comments$ = this._store.select($_commentsByPostId);
    this.isPostLoading$ = this._store.select($_postLoading);
    this.isPostHttpError$ = this._store.select($_postError);
    this.isCommentsLoading$ = this._store.select($_commentLoading);
  }

  public viewPreviousComments(postIdEvent: string) {
    const dto: GetCommentsByPostIdDto = {
      postId: postIdEvent,
      pageNumber: this.pageNumber,
      limit: 5,
    };
    this._store.dispatch(GetCommentsByPostId({ dto }));
    this.pageNumber++;
  }

  public viewCommentReplies(commentIdEvent: string) {
    // Get Comment By Id and includingReplies = 'true'
    // queryOpts: includingReplies, limit, page, sort;
    this._router.navigate(['post', 'comment', commentIdEvent]);
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
