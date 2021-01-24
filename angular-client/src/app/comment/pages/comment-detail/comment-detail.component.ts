import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { $_comment, GetCommentById, GetReplies } from '../../store';
import { CommentState } from '../../store/comment.state';
import { Comment } from '../../interfaces';

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

  constructor(
    private _route: ActivatedRoute,
    private _store: Store<CommentState>,
  ) { }

  ngOnInit(): void {
    this.initComment();
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

  public viewNextReplies(commentId: string) {
    const dto = {
      commentId: commentId,
      pageNumber: this.pageNumber,
      limit: 5,
    }
    this._store.dispatch(GetReplies({ dto }));
    this.pageNumber += 1;
  }

}
