import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as postActions from './post.actions';
import { PostService } from "../post.service";
import { PushManyComments } from "src/app/comment/store/comment.actions";

@Injectable()
export class PostEffects {

  getManyPosts = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetPosts),
    exhaustMap(() => this._postService.getPosts({
      page: 1,
      includeComments: true,
      includeReactions: true,
    }).pipe(
      map(posts => postActions.GetPostsSuccess({ posts })),
      catchError(error => of(postActions.GetPostsFailure({ error })))
    ))
  ));

  getPostById$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetPostById),
    exhaustMap(({ postId }) => this._postService.getPostById(postId, {
      includeComments: true,
      includeReactions: true,
    }).pipe(
      tap((post) => {
        if (post.comments && post.comments.length)
          this._store.dispatch(PushManyComments({ comments: post.comments }));
      }),
      map((post) => postActions.GetPostByIdSuccess({ post })),
      catchError(error => of(postActions.GetPostByIdFailure({ error })))
    ))
  ))

  constructor(
    private _store: Store,
    private _actions$: Actions,
    private _postService: PostService,
  ) { }

}