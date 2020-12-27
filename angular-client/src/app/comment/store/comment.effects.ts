import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as commentActions from './comment.actions';
import { CommentService } from "../comment.service";
import { $_commentCurrNext } from "./comment.selectors";

@Injectable()
export class CommentEffects {

  getApiComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetComments),
    switchMap(({ postId }) => this._commentService.getCommentsByPostId(postId).pipe(
      map(comments => commentActions.GetCommentsSuccess({ comments })),
      catchError(error => of(commentActions.GetCommentsFailure({ error })))
    ))
  ));

  getApiNextComments$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetNextComments),
    withLatestFrom(this._store.select($_commentCurrNext)),
    switchMap(([action, currNext]) => this._commentService.getCommentsByPostId(action.postId, currNext).pipe(
      map(comments => commentActions.GetNextCommentsSuccess({ comments })),
      catchError((error) => of(commentActions.GetNextCommentsFailure({ error })))
    ))
  ))

  constructor(
    private _store: Store,
    private _actions$: Actions,
    private _commentService: CommentService,
  ) { }

}