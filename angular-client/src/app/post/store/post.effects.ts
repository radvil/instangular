import { Injectable } from "@angular/core";
import { combineLatest, of } from 'rxjs';
import { map, exhaustMap, catchError, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as postActions from './post.actions';
import { PostService } from "../post.service";
import { PushManyComments } from "src/app/comment/store/comment.actions";
import { PostState } from "./post.state";
import { CommentState } from "src/app/comment/store/comment.state";
import { $_post } from "./post.selectors";

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
      map((post) => postActions.GetPostByIdSuccess({ post })),
      catchError(error => of(postActions.GetPostByIdFailure({ error })))
    ))
  ))

  pushComments = createEffect(() => this._actions$.pipe(
    ofType(
      postActions.GetPostByIdSuccess,
    ),
    withLatestFrom(
      combineLatest([
        this._store.select($_post),
      ])
    ),
    tap(([{ type }, [post]]) => {
      const { PostActionTypes } = postActions;
      switch (type) {
        case PostActionTypes.GET_POST_BY_ID_SUCCESS:
          if (post)
            if (post.comments && post.comments.length)
              this._store.dispatch(PushManyComments({ comments: post.comments }));
          return;
        default: return;
      }
    }),
  ), { dispatch: false })

  constructor(
    private _store: Store<PostState | CommentState>,
    private _actions$: Actions,
    private _postService: PostService,
  ) { }

}