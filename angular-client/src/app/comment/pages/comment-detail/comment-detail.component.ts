import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { compareToGetClass, ReactionsDialogComponent } from 'src/app/_shared';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/user';
import { PostComment, CommentReaction, CreatePostCommentReplyDto, GetRepliesDto, PostCommentReply } from '../../interfaces';
import { State } from '../../store/comment.state';
import { AddNewReply, GetRepliesByCommentId, ReactReply } from '../../store/actions/reply.actions';
import { GetCommentById, ReactComment } from '../../store/actions'
import { $_comment } from '../../store/selectors';
import { $_repliesByCommentId } from '../../store/selectors/reply.selectors';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnInit, OnDestroy {

  private _subscription = new Subscription();
  public commentId: string;
  public pageNumber = 1;
  public comment: PostComment;
  public replies: PostCommentReply[];
  public authUser: User;
  public pageHeaderTitle = "Comment Replies";
  public reactionsDialogRef: MatDialogRef<ReactionsDialogComponent>;

  private initAuthUser(): void {
    const authUser = this._store.select($_authUser);
    this._subscription.add(authUser.subscribe(user => this.authUser = user));
  }

  private initComment() {
    this._subscription.add(
      this._route.paramMap
        .pipe(map(param => param.get('commentId')))
        .subscribe(commentId => {
          this.commentId = commentId;
          if (this.commentId) {
            this.loadCommentDetail(this.commentId);
          }
        })
    );
    this._subscription.add(
      this._store.select($_comment).pipe(
        filter(comment => !!comment),
      ).subscribe(comment => {
        this.comment = comment;
        if (comment.commentedBy && comment.postRef) {
          const commentAuthor = this.decideUsernameText(comment.commentedBy?.username);
          const postAuthor = this.decideUsernameText(comment.postRef?.postedBy?.username);
          this.pageHeaderTitle = `Replies to ${commentAuthor} comment on ${postAuthor} post`;
        }
      })
    )
  }

  private initReplies() {
    this._subscription.add(
      this._store.select($_repliesByCommentId).subscribe(replies => {
        this.replies = replies;
      })
    );
  }

  private loadCommentDetail(commentId: string): void {
    this._store.dispatch(GetCommentById({ commentId }));
    this.pageNumber += 1;
  }

  private decideUsernameText(username: string): string {
    let properName = "";
    if (this.authUser) {
      if (this.authUser.username === username) {
        properName = `your`;
      } else {
        properName = `${username}'s`
      }
    }
    return properName;
  }

  showPost(postId: string): void {
    this._router.navigate(['post', postId]);
  }

  viewPreviousReplies(commentId: string) {
    const dto = <GetRepliesDto>{
      commentId: commentId,
      pageNumber: this.pageNumber,
      limit: 5,
    }
    this._store.dispatch(GetRepliesByCommentId({ dto }));
    this.pageNumber += 1;
  }

  viewUserProfile(usernameEvent: string): void {
    this._router.navigate(['user', usernameEvent]);
  }

  openReactionDialog(commentIdEvent: string, type: string): void {
    this.reactionsDialogRef = this._dialog.open(ReactionsDialogComponent, {
      width: '666px',
      panelClass: 'container',
    });

    const reactAndCloseDialog$ = this.reactionsDialogRef.beforeClosed().pipe(
      tap((reactionName: string) => {
        const dto = <CommentReaction>{
          commentId: commentIdEvent,
          variant: reactionName,
          reactedBy: this.authUser,
        }
        if (type === 'REPLY') {
          this._store.dispatch(ReactComment({ dto }));
        } else {
          this._store.dispatch(ReactReply({ dto }));
        }
      })
    )

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
      console.log('addNewReply(textInput) >> ' + textInput);
      const replyDto = <CreatePostCommentReplyDto>{
        postId: this.comment.postId,
        repliedTo: this.commentId,
        text: textInput,
      }
      this._store.dispatch(AddNewReply({ dto: replyDto }));
    }
  }

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<State>,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initAuthUser();
    this.initComment();
    this.initReplies();
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
