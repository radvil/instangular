import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, exhaustMap, tap } from 'rxjs/operators';

import * as commentActions from './comment.actions';
import { CommentService } from "../services/comment.service";
import { NotificationService } from "src/app/_shared/services";

@Injectable()
export class CommentEffects {

  getParentCommentsByPostId$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentsByPostId),
    exhaustMap(({ dto }) => this._commentService.getCommentsByPostId(dto).pipe(
      map(comments => commentActions.GetCommentsByPostIdSuccess({ comments })),
      catchError(error => of(commentActions.GetCommentsByPostIdFailure({ error })))
    ))
  ));

  getRepliesByCommentId$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentReplies),
    exhaustMap(({ dto }) => this._commentService.getRepliesByCommentId(dto).pipe(
      map(replies => commentActions.GetCommentRepliesSuccess({ replies })),
      catchError(error => of(commentActions.GetCommentsByPostIdFailure({ error })))
    ))
  ));

  addNewComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.AddComment),
    switchMap(({ dto }) => this._commentService.addComment(dto).pipe(
      map(comment => commentActions.AddCommentSuccess({ comment })),
      catchError(error => of(commentActions.AddCommentFailure({ error })))
    ))
  ))

  editComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.EditComment),
    switchMap(({ dto }) => this._commentService.editComment(dto).pipe(
      map(() => commentActions.EditCommentSuccess({ dto })),
      catchError(error => of(commentActions.EditCommentFailure({ error })))
    ))
  ))

  getCommentById$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentById),
    exhaustMap(({ commentId }) => this._commentService.getCommentById(commentId).pipe(
      map(comment => commentActions.GetCommentByIdSuccess({ comment })),
      catchError(error => of(commentActions.GetCommentByIdFailure({ error })))
    ))
  ))

  pushCommentsReplies$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetCommentByIdSuccess),
    tap(({ comment }) => {
      if (comment.replies.length) {
        this._store.dispatch(commentActions.PushManyComments({
          comments: comment.replies
        }))
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

  deleteComment$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.DeleteComment),
    switchMap(({ commentId }) => this._commentService.deleteComment(commentId).pipe(
      map(() => commentActions.DeleteCommentSuccess({ commentId })),
      catchError(error => of(commentActions.DeleteCommentFailure({ error })))
    ))
  ))

  onActionDone = createEffect(() => this._actions$.pipe(
    ofType(
      commentActions.AddCommentSuccess,
      commentActions.EditCommentSuccess,
      commentActions.DeleteCommentSuccess,
    ),
    tap(({ type }) => {
      switch (type) {
        case commentActions.CommentActionTypes.ADD_COMMENT_SUCCESS:
          this._notificationService.success('Comment added');
          break;
        case commentActions.CommentActionTypes.EDIT_COMMENT_SUCCESS:
          this._notificationService.info('Comment updated');
          break;
        case commentActions.CommentActionTypes.DELETE_COMMENT_SUCCESS:
          this._notificationService.default('Comment deleted');
          break;
        default: break;
      }
    })
  ), { dispatch: false })

  constructor(
    private _actions$: Actions,
    private _commentService: CommentService,
    private _notificationService: NotificationService,
    private _store: Store<Comment>,
  ) { }

}