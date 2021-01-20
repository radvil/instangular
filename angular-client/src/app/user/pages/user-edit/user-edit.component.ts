import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthState } from 'src/app/auth';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { UploadProfilePictureComponent } from 'src/app/_shared/components';
import { User } from '../../interfaces';
import { UserState } from '../../store/user.state';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  private _subscription = new Subscription();
  public authUser: User;
  public photoDialogRef: MatDialogRef<UploadProfilePictureComponent>;

  private initAuthUser(): void {
    this._subscription.add(
      this._store.select($_authUser).subscribe(user => this.authUser = user)
    )
  }

  openPhotoDialog(): void {
    this.photoDialogRef = this._dialog.open(UploadProfilePictureComponent, {
      width: '666px',
      panelClass: 'dialogPanel',
    })
  }

  constructor(
    private _store: Store<UserState | AuthState>,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initAuthUser();
  }
}
