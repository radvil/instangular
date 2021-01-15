import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, switchMap, catchError, exhaustMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as commentActions from './comment.actions';
import { CommentService } from "../comment.service";

@Injectable()
export class CommentEffects {

  getApiComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentsByPostId),
    exhaustMap(({ dto }) => this._commentService.getCommentsByPostId(dto).pipe(
      map(comments => commentActions.GetCommentsByPostIdSuccess({ comments })),
      catchError(error => of(commentActions.GetCommentsByPostIdFailure({ error })))
    ))
  ));

  addComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.AddComment),
    switchMap(({ createCommentDto }) => this._commentService.addComment(createCommentDto).pipe(
      map(comment => commentActions.AddCommentSuccess({ comment })),
      catchError(error => of(commentActions.AddCommentFailure({ error })))
    ))
  ))

  constructor(
    private _actions$: Actions,
    private _commentService: CommentService,
  ) { }

}