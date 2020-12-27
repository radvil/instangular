import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { $_commentError, $_commentLoading, $_commentsOfPost, Comment } from 'src/app/comment';
import { GetComments } from 'src/app/comment/store/comment.actions';
import { CommentState } from 'src/app/comment/store/comment.state';
import { Post } from '../post.interface';
import { GetPostById } from '../store/post.actions';
import { $_post } from '../store/post.selectors';
import { PostState } from '../store/post.state';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit {

  public isLoading$: Observable<boolean>;
  public httpError$: Observable<Error>;
  public postId$: Observable<string>;
  public post$: Observable<Post>;
  public comments$: Observable<Comment[]>;

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
    this.post$ = this.postId$.pipe(
      switchMap(() => this._store.select($_post))
    );
    this.comments$ = this._store.select($_commentsOfPost);
  }

  constructor(
    private _store: Store<CommentState | PostState>,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initValues();
  }

}
