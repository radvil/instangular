import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, switchMap, catchError, exhaustMap, withLatestFrom } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as commentActions from './comment.actions';
import { CommentService } from "../comment.service";
import { Store } from "@ngrx/store";
import { Comment } from "../comment.interface";
import { CommentState } from "./comment.state";
import { $_commentSelectedId } from "./comment.selectors";

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
      map(comment => commentActions.GetCommentByIdSuccess({ comment })),
      catchError(error => of(commentActions.GetCommentByIdFailure({ error })))
    ))
  ))

  getCommentReplies$ = createEffect(() => this._actions$.pipe(
    ofType(commentActions.GetReplies),
    exhaustMap(({ dto }) => this._commentService.getRepliesByCommentId({
      commentId: dto.commentId,
      pageNumber: dto.pageNumber,
      limit: 5
    }).pipe(
      map(replies => commentActions.GetRepliesSuccess({
        commentId: replies[0].repliedTo,
        replies
      })),
      catchError(error => of(commentActions.GetRepliesFailure({ error })))
    ))
  ))

  constructor(
    private _actions$: Actions,
    private _store: Store<CommentState>,
    private _commentService: CommentService,
  ) { }

}