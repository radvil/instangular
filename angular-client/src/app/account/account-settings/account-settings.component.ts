import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthState } from 'src/app/auth';
import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/user';
import { UserState } from 'src/app/user/store/user.state';
import { ConfirmDialogComponent } from 'src/app/_shared';
import { AccountUpdateInfoComponent } from '../account-update-info/account-update-info.component';
import { AccountUpdatePasswordComponent } from '../account-update-password/account-update-password.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  public authUser: User;
  public updateInfoDialogRef: MatDialogRef<AccountUpdateInfoComponent>;
  public updatePasswordDialogRef: MatDialogRef<AccountUpdatePasswordComponent>;
  public deleteDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _subscription = new Subscription();

  constructor(
    private _store: Store<AuthState | UserState>,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._subscription.add(
      this._store.select($_authUser).subscribe(user => this.authUser = user)
    )
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  openUpdateInfoDialog(): void {
    this.updateInfoDialogRef = this._dialog.open(AccountUpdateInfoComponent, {
      width: '555px',
      panelClass: 'dialogPanel',
      disableClose: true,
      data: { user: this.authUser }
    });
  }

  openUpdatePasswordDialog(): void {
    this.updatePasswordDialogRef = this._dialog.open(AccountUpdatePasswordComponent, {
      width: '555px',
      panelClass: 'dialogPanel',
      disableClose: true,
    });

    this._subscription.add(
      this.updatePasswordDialogRef.beforeClosed().subscribe(formValue => {
        if (formValue) console.log(formValue);
        else console.log('dialog closed!');
      })
    );
  }

  openDeleteDialog(): void {
    this.deleteDialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '555px',
      panelClass: 'dialogPanel',
      data: { message: 'Are you sure want to delete your account ?\n This action can not be undone' }
    });

    this._subscription.add(
      this.deleteDialogRef.beforeClosed().subscribe(confirmed => {
        if (confirmed) console.log(confirmed);
        else console.log('dialog closed!');
      })
    );
  }

}
