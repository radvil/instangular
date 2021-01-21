import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { $_authUser } from 'src/app/auth/store/auth.selectors';
import {
  PostComment,
  CreatePostCommentDto,
  GetPostCommentsDto
} from 'src/app/comment/interfaces';
import { AddComment, GetCommentsByPostId } from 'src/app/comment/store/actions';
import {
  $_commentLoading,
  $_commentsByPostId,
  $_commentsByPostIdHasNextPage,
} from 'src/app/comment/store/selectors';
import { User } from 'src/app/user';
import { Post } from '../../interfaces';
import { GetPostById } from '../../store/post.actions';
import { $_post, $_postLoading } from '../../store/post.selectors';


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

  public authUser: User;
  public post: Post;
  public comments$: Observable<PostComment[]>;
  public postCommentsHasNext$: Observable<boolean>;
  public pageHeaderTitle = 'Post Detail';
  public commentInputClass: string = null;

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
    this._subscription.add(
      this._store.select($_authUser).subscribe((user) => (this.authUser = user))
    );
    this._subscription.add(
      this._store.select($_post).subscribe((post) => {
        this.post = post;
        if (post) {
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

  openEditPostDialog() {
    alert('Open update post dialog');
  }

  openDeletePostDialog() {
    alert('Open delete post dialog');
  }

  viewPreviousComments(postIdEvent: string) {
    const dto: GetPostCommentsDto = {
      postId: postIdEvent,
      pageNumber: this.pageNumber,
      limit: 5,
    };
    this._store.dispatch(GetCommentsByPostId({ dto }));
    this.pageNumber++;
  }

  viewCommentReplies(commentIdEvent: string) {
    // Get Comment By Id and includingReplies = 'true'
    // queryOpts: includingReplies, limit, page, sort;
    this._router.navigate(['comment', commentIdEvent]);
  }

  viewUserProfile(usernameEvent: string) {
    this._router.navigate(['user', usernameEvent]);
  }

  openCommentForm() {
    this.commentInputClass = 'sticky';
    // TODO: doSomething like autofocus input to "on"
  }

  commentToPost(text: string, postId: string) {
    if (this.post && text) {
      const createCommentDto = <CreatePostCommentDto>{ postId, text };
      this._store.dispatch(AddComment({ createCommentDto }));
    }
  }

  showOptions(): void {
    alert('Showing comments options');
  }

  constructor(
    private _store: Store,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.initValues();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
