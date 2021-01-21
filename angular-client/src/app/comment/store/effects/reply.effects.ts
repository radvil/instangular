import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, catchError, exhaustMap, switchMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as replyActions from '../actions/reply.actions';
import { ReplyService } from "../../services/reply.service";
import { NotificationService } from "src/app/_shared/services";
import { CommentService } from "../../services";

@Injectable()
export class ReplyEffects {

  getReplies$ = createEffect(() => this._actions$.pipe(
    ofType(replyActions.GetRepliesByCommentId),
    exhaustMap(({ dto }) => this._replyService.getRepliesByCommentId({
      commentId: dto.commentId,
      pageNumber: dto.pageNumber,
      limit: 5,
    }).pipe(
      map(replies => replyActions.GetRepliesByCommentIdSuccess({ replies })),
      catchError(error => of(replyActions.GetRepliesByCommentIdFailure({ error })))
    ))
  ))

  reactReply$ = createEffect(() => this._actions$.pipe(
    ofType(replyActions.ReactReply),
    switchMap(({ dto }) => this._commentService.reactComment(dto).pipe(
      map(_ => replyActions.ReactReplySuccess({ data: dto })),
      catchError(error => of(replyActions.ReactReplyFailure({ error })))
    ))
  ))

  addReply$ = createEffect(() => this._actions$.pipe(
    ofType(replyActions.AddNewReply),
    switchMap(({ dto }) => this._replyService.createNewReply(dto).pipe(
      map(reply => replyActions.AddNewReplySuccess({ reply })),
      catchError(error => of(replyActions.AddNewReplyFailure({ error })))
    ))
  ))

  addReplySuccess$ = createEffect(() => this._actions$.pipe(
    ofType(replyActions.AddNewReplySuccess),
    tap(() => {
      this._notificationService.success('Reply added');
    })
  ), { dispatch: false })

  constructor(
    private _actions$: Actions,
    private _replyService: ReplyService,
    private _commentService: CommentService,
    private _notificationService: NotificationService,
  ) { }

}