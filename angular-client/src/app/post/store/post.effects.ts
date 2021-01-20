import { Injectable } from "@angular/core";
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as postActions from './post.actions';
import { PostService } from "../services/post.service";
import { PushManyComments } from "src/app/comment/store/actions/comment.actions";
import { NotificationService } from "src/app/_shared/services";

@Injectable()
export class PostEffects {

  getManyPosts = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetPosts),
    exhaustMap(() => this._postService.getPosts({
      page: 1,
      includeComments: true,
      includeReactions: true,
    }).pipe(
      map(posts => postActions.GetPostsSuccess({ posts })),
      catchError(error => of(postActions.GetPostsFailure({ error })))
    ))
  ));

  getPostById$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.GetPostById),
    exhaustMap(({ postId }) => this._postService.getPostById(postId, {
      includeComments: true,
      includeReactions: true,
    }).pipe(
      tap((post) => {
        if (post.comments && post.comments.length)
          this._store.dispatch(PushManyComments({ comments: post.comments }));
      }),
      map((post) => postActions.GetPostByIdSuccess({ post })),
      catchError(error => of(postActions.GetPostByIdFailure({ error })))
    ))
  ))

  updatePostById$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.UpdatePostById),
    switchMap(({ postId, changes }) => this._postService.updatePostById(postId, changes).pipe(
      map(post => postActions.UpdatePostByIdSuccess({ post })),
      catchError(error => of(postActions.UpdatePostByIdFailure({ error })))
    ))
  ))

  deletePostById$ = createEffect(() => this._actions$.pipe(
    ofType(postActions.DeletePostById),
    switchMap(({ postId }) => this._postService.deletePostById(postId).pipe(
      map(_ => postActions.DeletePostByIdSuccess({ postId })),
      catchError(error => of(postActions.DeletePostByIdFailure({ error })))
    ))
  ))

  doneActions$ = createEffect(() => this._actions$.pipe(
    ofType(
      postActions.UpdatePostByIdSuccess,
      postActions.DeletePostByIdSuccess,
    ),
    tap((action) => {
      switch (action.type) {
        case postActions.PostActionTypes.UPDATE_POST_BY_ID_SUCCESS:
          this._notificationService.success('Post updated');
          break;
        case postActions.PostActionTypes.DELETE_POST_BY_ID_SUCCESS:
          this._notificationService.success('Post deleted');
          break;
        default:
          this._notificationService.error('Failed');
      }
    })
  ), { dispatch: false })

  constructor(
    private _store: Store,
    private _actions$: Actions,
    private _postService: PostService,
    private _notificationService: NotificationService,
  ) { }

}