import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { LoadingDialogComponent } from 'src/app/_shared';
import { AddPost } from '../../store/post.actions';
import { $_postLoaded } from '../../store/post.selectors';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.scss']
})
export class PostAddComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public imagePreviewPath: string;
  public loadingDialog: MatDialogRef<LoadingDialogComponent>;
  private _subscription = new Subscription();

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _store: Store,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initAddForm();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private initAddForm(): void {
    this.form = this._fb.group({
      description: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
      ]],
      tags: [null],
      image: [null, [Validators.required]]
    })
  }

  public submitPost(): void {
    this.form.disable();
    this._store.dispatch(AddPost({ dto: this.form.value }));
    this.openLoadingDialog();
  }

  public onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => this.imagePreviewPath = <string>fileReader.result;
      fileReader.readAsDataURL(file);

      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
    }
  }

  public openLoadingDialog(): void {
    this.loadingDialog = this._dialog.open(LoadingDialogComponent, {
      disableClose: true,
      panelClass: 'dialogPanel',
      width: '15rem',
      height: '15rem',
      data: {
        message: "Submitting post",
      },
    })

    this._subscription.add(
      this._store.select($_postLoaded)
        .subscribe(isLoaded => {
          if (isLoaded) {
            this.loadingDialog.componentInstance.setLoading(false);
          }
        })
    )

    this._subscription.add(
      this.loadingDialog.afterClosed().subscribe(_ => this.goHome())
    );
  }

  public goHome(): void {
    this._router.navigateByUrl('/home');
  }

}
