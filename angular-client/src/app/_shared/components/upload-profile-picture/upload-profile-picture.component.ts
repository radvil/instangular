import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthState } from 'src/app/auth';
import { $_authUser } from 'src/app/auth/store/auth.selectors';

import { UploadUserProfilePicture } from 'src/app/user/store/user.actions';
import { $_userLoaded, $_userLoading } from 'src/app/user/store/user.selectors';
import { UserState } from 'src/app/user/store/user.state';

@Component({
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss']
})
export class UploadProfilePictureComponent implements OnInit {
  public imagePreviewPath: string;
  public selectedImage: File;
  public isLoading$: Observable<boolean>;
  public isLoaded$: Observable<boolean>;
  private _subscription = new Subscription();

  constructor(
    private _store: Store<UserState | AuthState>,
  ) { }

  ngOnInit(): void {
    this.setLoadingStatus();
    this._subscription.add(
      this._store
        .select($_authUser)
        .pipe(tap(user => user.photo && (this.imagePreviewPath = user.photo)))
        .subscribe()
    )
  }

  public onFileSelected(event: Event) {
    const file = (<HTMLInputElement>event.target).files[0];

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => this.imagePreviewPath = <string>fileReader.result;
      fileReader.readAsDataURL(file);
      this.selectedImage = file;
    }
  }

  public submitUpload(): void {
    if (this.selectedImage) {
      this._store.dispatch(UploadUserProfilePicture({ photo: this.selectedImage }));
    }
  }

  private setLoadingStatus(): void {
    this.isLoading$ = this._store.select($_userLoading);
    this.isLoaded$ = this._store.select($_userLoaded);
  }

}
