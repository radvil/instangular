import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { $_isLoaded, $_isLoading } from 'src/app/auth/store/auth.selectors';
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

  constructor(
    private _store: Store<UserState>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._store.select($_isLoading);
    this.isLoaded$ = this._store.select($_isLoaded);
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
    console.log('TODO:// UPLOADING');
    console.log(this.selectedImage);
  }

}
