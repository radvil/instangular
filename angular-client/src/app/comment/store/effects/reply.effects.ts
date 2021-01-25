import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, catchError, exhaustMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as replyActions from '../actions/reply.actions';
import { ReplyService } from "../../services/reply.service";

@Injectable()
export class ReplyEffects {

  getReplies = createEffect(() => this._actions$.pipe(
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

  constructor(
    private _actions$: Actions,
    private _replyService: ReplyService,
  ) { }

}