import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { compareToGetClass } from 'src/app/_shared';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/user';
import { Comment, CreateReplyDto, GetRepliesDto, Reply } from '../../interfaces';
import { CommentState } from '../../store/states/comment.state';
import { AddNewReply, GetRepliesByCommentId } from '../../store/actions/reply.actions';
import { GetCommentById } from '../../store/actions'
import { $_comment } from '../../store/selectors';
import { $_repliesByCommentId } from '../../store/selectors/reply.selectors';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnInit, OnDestroy {

  private _subscription = new Subscription();
  public commentId: string;
  public pageNumber = 1;
  public comment: Comment;
  public replies: Reply[];
  public authUser: User;
  public pageHeaderTitle = "Comment Replies";

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
        if (comment.commentedBy.username) {
          this.pageHeaderTitle = `Replies to ${comment.commentedBy.username}'s comment`;
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

  reactToComment(commentIdEvent: string): void {
    alert('TODO:// reactToComment / reactToCommentReply');
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
      const replyDto = <CreateReplyDto>{
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
    private _store: Store<CommentState>,
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
