import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { $_comment, GetCommentById, GetReplies } from '../../store';
import { CommentState } from '../../store/comment.state';
import { Comment } from '../../interfaces';
import { compareToGetClass } from 'src/app/_shared';
import { User } from 'src/app/user';
import { $_authUser } from 'src/app/auth';

@Component({
  selector: 'app-comment-detail',
  templateUrl: './comment-detail.component.html',
  styleUrls: ['./comment-detail.component.scss']
})
export class CommentDetailComponent implements OnInit {

  private _subscription = new Subscription();
  public commentId: string;
  public pageNumber = 1;
  public comment$: Observable<Comment>;
  public authUser: User;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<CommentState>,
  ) { }

  ngOnInit(): void {
    this.initAuthUser();
    this.initComment();
  }

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
    this.comment$ = this._store.select($_comment);
  }

  private loadCommentDetail(commentId: string): void {
    this._store.dispatch(GetCommentById({ commentId }));
    this.pageNumber += 1;
  }

  public viewPreviousReplies(commentId: string) {
    const dto = {
      commentId: commentId,
      pageNumber: this.pageNumber,
      limit: 5,
    }
    this._store.dispatch(GetReplies({ dto }));
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

  public getCommentClassByUsername(username: string) {
    return compareToGetClass(this.authUser.username, username);
  }

}
