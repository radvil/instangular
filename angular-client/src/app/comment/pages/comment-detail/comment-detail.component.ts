import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { compareToGetClass, ReactionsDialogComponent } from 'src/app/_shared';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/user';
import { State as CommentState } from '../../store/comment.state';
import {
  PostComment,
  CommentReaction,
  CreatePostCommentDto,
  GetCommentRepliesDto,
} from '../../interfaces';
import {
  AddComment,
  GetCommentReplies,
  ReactComment,
  GetCommentById,
} from '../../store/comment.actions';
import {
  $_comment,
  $_commentsAsRepliesByCommentId,
  $__commentIsLoading,
} from '../../store/comment.selectors';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss'],
})
export class CommentDetailComponent implements OnInit, OnDestroy {
  public pageHeaderTitle = 'Comment Replies';
  public reactionsDialogRef: MatDialogRef<ReactionsDialogComponent>;
  public authUser: User;
  public commentId: string;
  public comment: PostComment;
  public replies: PostComment[];
  public pageNumber = 1;
  public isLoading$: Observable<boolean>;
  private _subscription = new Subscription();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<CommentState>,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initAuthUser();
    this.initParentComment();
    this.initChildrenComments();
    this.isLoading$ = this._store.select($__commentIsLoading);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private initAuthUser(): void {
    const authUser = this._store.select($_authUser);
    this._subscription.add(
      authUser.subscribe((user) => (this.authUser = user))
    );
  }

  private initParentComment() {
    this._subscription.add(
      this._route.paramMap
        .pipe(map((param) => param.get('commentId')))
        .subscribe((commentId) => {
          this.commentId = commentId;
          if (this.commentId) {
            this.loadCommentDetail(this.commentId);
          }
        })
    );
    this._subscription.add(
      this._store
        .select($_comment)
        .pipe(filter((comment) => !!comment))
        .subscribe((comment) => {
          this.comment = comment;
          if (comment.commentedBy && comment.postRef) {
            const commentAuthor = this.decideUsernameText(
              comment.commentedBy?.username
            );
            const postAuthor = this.decideUsernameText(
              comment.postRef?.postedBy?.username
            );
            this.pageHeaderTitle = `Replies to ${commentAuthor} comment on ${postAuthor} post`;
          }
        })
    );
  }

  private initChildrenComments() {
    this._subscription.add(
      this._store
        .select($_commentsAsRepliesByCommentId)
        .subscribe((replies) => {
          this.replies = replies;
        })
    );
  }

  private loadCommentDetail(commentId: string): void {
    this._store.dispatch(GetCommentById({ commentId }));
    this.pageNumber += 1;
  }

  private decideUsernameText(username: string): string {
    let properName = '';
    if (this.authUser) {
      if (this.authUser.username === username) {
        properName = `your`;
      } else {
        properName = `${username}'s`;
      }
    }
    return properName;
  }

  showPost(postId: string): void {
    this._router.navigate(['post', postId]);
  }

  viewPreviousCommentReplies(commentId: string) {
    const dto = <GetCommentRepliesDto>{
      commentId: commentId,
      pageNumber: this.pageNumber,
      limit: 5,
    };
    this._store.dispatch(GetCommentReplies({ dto }));
    this.pageNumber += 1;
  }

  openReactionDialog(commentIdEvent: string, type: string): void {
    this.reactionsDialogRef = this._dialog.open(ReactionsDialogComponent, {
      width: '666px',
      panelClass: 'dialogPanel',
    });

    const reactAndCloseDialog$ = this.reactionsDialogRef.beforeClosed().pipe(
      tap((reactionName: string) => {
        const dto = <CommentReaction>{
          commentId: commentIdEvent,
          variant: reactionName,
          reactedBy: this.authUser,
        };
        if (type === 'REPLY') {
          this._store.dispatch(ReactComment({ dto }));
        } else {
          this._store.dispatch(ReactComment({ dto }));
        }
      })
    );

    this._subscription.add(reactAndCloseDialog$.subscribe());
  }

  replyToComment(commentIdEvent: string): void {
    alert('TODO:// replyToComment / replyToCommentReply');
  }

  showCommentReactions(commentIdEvent: string): void {
    alert('TODO:// showCommentReactions / showCommentReplyReactions');
  }

  getCommentClassByUsername(username: string) {
    return compareToGetClass(this.authUser.username, username);
  }

  addNewReply(textInput: string): void {
    if (this.comment) {
      const dto = <CreatePostCommentDto>{
        postId: this.comment.postId,
        repliedTo: this.commentId,
        text: textInput,
      };
      this._store.dispatch(AddComment({ dto }));
    }
  }
}
