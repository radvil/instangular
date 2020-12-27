import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as postActions from './post.actions';
import { PostService } from "../post.service";
import { $_postCurrNext } from "./post.selectors";
import { Post } from "../post.interface";

@Injectable()
export class PostEffects {

  getApiPost$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetPosts),
    switchMap(() => this._postService.getIncrementalPosts().pipe(
      map(posts => postActions.GetPostsSuccess({ posts })),
      catchError(error => of(postActions.GetPostsFailure({ error })))
    ))
  ));

  getApiNextPosts$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetNextPosts),
    withLatestFrom(this._store.select($_postCurrNext)),
    switchMap(([action, currNext]) => this._postService.getIncrementalPosts(currNext).pipe(
      map(posts => postActions.GetNextPostsSuccess({ posts })),
      catchError((error) => of(postActions.GetNextPostsFailure({ error })))
    ))
  ))

  getPostById$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetPostById),
    switchMap(({ postId }) => this._postService.getPostById(postId).pipe(
      map(post => postActions.GetPostByIdSuccess({ post })),
      catchError(error => of(postActions.GetPostByIdFailure({ error })))
    ))
  ))

  constructor(
    private _store: Store<Post | Comment>,
    private _actions$: Actions,
    private _postService: PostService,
  ) { }

}