import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { $_authUser } from 'src/app/auth/store';
import {
  AddComment,
  GetCommentsByPostId,
  $_commentLoading,
  $_commentsByPostId,
  $_commentsByPostIdHasNextPage,
} from 'src/app/comment/store';
import {
  Comment,
  CreateCommentDto,
  GetCommentsDto,
} from 'src/app/comment/interfaces';
import { User } from 'src/app/user';
import { GetPostById, $_post, $_postLoading } from '../../store';
import { Post } from '../../interfaces';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private pageNumber = 1;
  private _subscription = new Subscription();
  public isPostLoading$: Observable<boolean>;
  public isCommentsLoading$: Observable<boolean>;

  public authUser$: Observable<User>;
  public post$: Observable<Post>;
  public comments$: Observable<Comment[]>;
  public postCommentsHasNext$: Observable<boolean>;
  public pageHeaderTitle = 'Post Detail';

  private initValues(): void {
    this._subscription.add(
      this._route.paramMap
        .pipe(
          map((param) => param.get('postId')),
          tap((postId) => {
            this._store.dispatch(GetPostById({ postId }));
            this.pageNumber += 1;
          })
        )
        .subscribe()
    );

    this.authUser$ = this._store.select($_authUser);
    this.post$ = this._store.select($_post).pipe(
      filter((post) => !!post),
      tap((post) => {
        if (post.postedBy.username) {
          this.pageHeaderTitle = post.postedBy.username + "'s post";
        }
      })
    );
    this.comments$ = this._store.select($_commentsByPostId);
    this.postCommentsHasNext$ = this._store.select(
      $_commentsByPostIdHasNextPage
    );
    this.isPostLoading$ = this._store.select($_postLoading);
    this.isCommentsLoading$ = this._store.select($_commentLoading);
  }

  public viewPreviousComments(postIdEvent: string) {
    const dto: GetCommentsDto = {
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
    this._router.navigate(['comment', commentIdEvent]);
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
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
