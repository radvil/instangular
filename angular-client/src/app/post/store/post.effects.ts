import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as postActions from './post.actions';
import { PostService } from "../post.service";
import { $_postCurrNext } from "./post.selectors";

@Injectable()
export class PostEffects {

  getApiPost$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.ApiGetPosts),
    switchMap(() => this._postService.getIncrementalPosts().pipe(
      map(posts => postActions.ApiGetPostsSuccess({ posts })),
      catchError(error => of(postActions.ApiGetPostsFailure({ error })))
    ))
  ));

  getApiNextPosts$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.ApiGetNextPosts),
    withLatestFrom(this._store.select($_postCurrNext)),
    switchMap(([action, currNext]) => this._postService.getIncrementalPosts(currNext).pipe(
      map(posts => postActions.ApiGetNextPostsSuccess({ posts })),
      catchError((error) => of(postActions.ApiGetNextPostsFailure({ error })))
    ))
  ))

  constructor(
    private _store: Store,
    private _actions$: Actions,
    private _postService: PostService,
  ) { }

}