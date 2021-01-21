import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, switchMap, catchError, exhaustMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as commentActions from './comment.actions';
import { CommentService } from "../services/comment.service";
import { NotificationService } from "src/app/_shared/services";

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

  onAddCommentSuccess$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.AddCommentSuccess),
    tap(() => {
      this._notificationService.success('Comment added');
    })
  ), { dispatch: false })

  getCommentById$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentById),
    exhaustMap(({ commentId }) => this._commentService.getCommentById(commentId).pipe(
      map(comment => commentActions.GetCommentByIdSuccess({ comment })),
      catchError(error => of(commentActions.GetCommentByIdFailure({ error })))
    ))
  ))

  pushComments$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentByIdSuccess),
    tap(({ comment }) => {
      if (comment.replies.length) {
        commentActions.PushManyComments({ comments: comment.replies });
      }
    })
  ), { dispatch: false })

  reactComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.ReactComment),
    switchMap(({ dto }) => this._commentService.reactComment(dto).pipe(
      map(_ => commentActions.ReactCommentSuccess({ data: dto })),
      catchError(error => of(commentActions.ReactCommentFailure({ error })))
    ))
  ))

  constructor(
    private _actions$: Actions,
    private _commentService: CommentService,
    private _notificationService: NotificationService,
  ) { }

}