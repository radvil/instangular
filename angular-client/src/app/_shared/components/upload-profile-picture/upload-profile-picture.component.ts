import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthState } from 'src/app/auth';
import { $_authUser } from 'src/app/auth/store/auth.selectors';

import { UploadUserProfilePicture } from 'src/app/user/store/user.actions';
import { $_userLoaded, $_userLoading } from 'src/app/user/store/user.selectors';
import { UserState } from 'src/app/user/store/user.state';

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss'],
})
export class UploadProfilePictureComponent implements OnInit, OnDestroy {
  public imagePreviewPath: string;
  public selectedImage: File;
  public isUploadingSub = new BehaviorSubject(false);
  public isUploadedSub = new BehaviorSubject(false);
  public buttonTextSub = new BehaviorSubject("Upload Now");
  private _subscription = new Subscription();

  get isUploading(): boolean {
    return this.isUploadingSub.value;
  }

  get isUploaded(): boolean {
    return this.isUploadedSub.value;
  }

  constructor(private _store: Store<UserState | AuthState>) { }

  ngOnInit(): void {
    this._subscription.add(
      this._store
        .select($_authUser)
        .pipe(tap((user) => user.photo && (this.imagePreviewPath = user.photo)))
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () =>
        (this.imagePreviewPath = <string>fileReader.result);
      fileReader.readAsDataURL(file);
      this.selectedImage = file;
    }
  }

  submitUpload(): void {
    if (this.selectedImage) {
      this._store.dispatch(
        UploadUserProfilePicture({ photo: this.selectedImage })
      );
      this._subscription.add(
        this._store
          .select($_userLoading)
          .pipe(
            tap(isLoading => {
              if (isLoading) {
                this.buttonTextSub.next("🎵 Uploading..");
                this.isUploadingSub.next(true);
              }
            })
          )
          .subscribe()
      );
      this._subscription.add(
        this._store
          .select($_userLoaded)
          .pipe(
            tap(isLoaded => {
              if (isLoaded) {
                this.buttonTextSub.next("✔️ Uploaded..");
                this.isUploadedSub.next(true);
              }
            })
          )
          .subscribe()
      );
    }
  }
}
