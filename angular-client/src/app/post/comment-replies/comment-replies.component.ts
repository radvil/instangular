import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-comment-replies',
  templateUrl: './comment-replies.component.html',
  styleUrls: ['./comment-replies.component.scss']
})
export class CommentRepliesComponent implements OnInit {

  private _subscription = new Subscription();

  constructor(
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._subscription.add(
      this._route.paramMap
        .pipe(map(param => param.get('commentId')))
        .subscribe(commentId => {
          console.log(commentId)
          // this._store.dispatch(GetPostById({ postId }));
          // this.pageNumber += 1;
        })
    );
  }

}
