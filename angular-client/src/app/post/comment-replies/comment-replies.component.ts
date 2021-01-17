import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { $_comment, Comment } from 'src/app/comment';
import { GetReplies } from 'src/app/comment/store/comment.actions';
import { CommentState } from 'src/app/comment/store/comment.state';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.scss']
})
export class CommentRepliesComponent implements OnInit {

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
            this.loadComment(this.commentId);
          }
        })
    );
    this.comment$ = this._store.select($_comment);
  }

  private loadComment(commentId: string): void {
    const dto = {
      commentId: commentId,
      pageNumber: this.pageNumber,
      limit: 5,
    }
    this._store.dispatch(GetReplies({ dto }));
    this.pageNumber += 1;
  }

}
