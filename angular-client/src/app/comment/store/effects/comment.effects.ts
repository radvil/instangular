import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, switchMap, catchError, exhaustMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as commentActions from '../actions/comment.actions';
import { CommentService } from "../../services/comment.service";
import { ReplyState } from "../states";
import { PushManyReplies } from "../actions";

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

  getCommentById$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentById),
    exhaustMap(({ commentId }) => this._commentService.getCommentById(commentId).pipe(
      map(comment => {
        if (comment.replies) {
          this._store.dispatch(PushManyReplies({ replies: comment.replies }));
        }
        return commentActions.GetCommentByIdSuccess({ comment });
      }),
      catchError(error => of(commentActions.GetCommentByIdFailure({ error })))
    ))
  ))

  constructor(
    private _actions$: Actions,
    private _commentService: CommentService,
    private _store: Store<ReplyState>,
  ) { }

}