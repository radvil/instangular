import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { CreateCommentDto } from 'src/app/comment/interfaces';
import { AddComment } from 'src/app/comment/store/actions';
import { CreatePostDto, Post } from 'src/app/post/interfaces';
import { User } from 'src/app/user/interfaces';
import { UpdatePostById } from '../../store/post.actions';
import { PostEditDialogComponent } from '../post-edit-dialog/post-edit-dialog.component';


@Component({
  selector: 'nsg-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent implements OnDestroy {
  @Input() post: Post;
  @Input() authUser: User;
  @Input() textInputClass: string = null;
  @Output() onCommentClicked = new EventEmitter<string>();

  public updateDialogRef: MatDialogRef<PostEditDialogComponent>;
  private _subscription = new Subscription();

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _store: Store,
    private _router: Router,
  ) { }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  public get showedReactionUsername(): string {
    if (this.post.reactions.length > 0) {
      return this.post.reactions[0].reactedBy.username;
    } else {
      return null;
    }
  }

  public get reactionsCount(): number {
    return this.post.reactionsCount;
  }

  viewUserProfile(usernameEvent: string) {
    this._router.navigate(['user', usernameEvent]);
  }

  openUpdatePostDialog(postIdEvent: string) {
    this.updateDialogRef = this._dialog.open(PostEditDialogComponent, {
      width: '333px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'updatePostDialog',
      data: { postId: postIdEvent, currentPost: this.post }
    });

    const updateAndCloseDialog$ = this.updateDialogRef.beforeClosed().pipe(
      tap((dto: CreatePostDto) => {
        if (dto) {
          let changes = { description: dto.description };
          this._store.dispatch(UpdatePostById({ postId: postIdEvent, changes }));
        }
      })
    )

    this._subscription.add(updateAndCloseDialog$.subscribe());
  }

  selectMenuDelete(postIdEvent: string) {
    // TODO: //delete popup
  }

  clickReact(postId: string) {
    console.log('PLEASE REWORK THOSE INPUTS OUPUTS')
    alert('TODO:// openReactionsDialog(postId)');
  }

  clickComment(postId: string) {
    // this.onCommentClicked.emit(postId);
    alert('TODO:// Autofocus to input');
  }

  clickShare(postId: string) {
    alert('TODO:// openShareOptions(postId)');
  }

  clickSave(postId: string) {
    alert('TODO:// openSaveOptions(postId)');
  }

  commentToPost(text: string, commentedBy: string) {
    if (text && this.post._id) {
      const createCommentDto = <CreateCommentDto>{
        postId: this.post._id,
        text: text,
        commentedBy,
      }
      this._store.dispatch(AddComment({ createCommentDto }));
    }
  }

}
