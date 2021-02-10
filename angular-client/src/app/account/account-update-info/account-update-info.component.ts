import { Component, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';

import { User, UserSensitivesInfoDto } from 'src/app/user';
import { UpdateUserSensitivesInfo } from 'src/app/user/store/user.actions';
import { $_userError, $_userLoaded, $_userLoading } from 'src/app/user/store/user.selectors';
import { UserState } from 'src/app/user/store/user.state';

@Component({
  selector: 'app-account-update-info',
  templateUrl: './account-update-info.component.html',
  styleUrls: ['./account-update-info.component.scss']
})
export class AccountUpdateInfoComponent implements OnDestroy {
  public formGroup: FormGroup;
  public isLoadingSub = new BehaviorSubject(false);
  private _subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public _dialogRef: MatDialogRef<AccountUpdateInfoComponent>,
    private _store: Store<UserState>,
  ) {
    if (this.data.user) {
      this.formGroup = new FormGroup({
        username: new FormControl(this.data.user.username, [Validators.required]),
        email: new FormControl(this.data.user.email, [Validators.required, Validators.email]),
      });
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  // #region getters
  get submitButtonText(): string {
    if (this.isLoadingSub.value) {
      return "Submittting...";
    } else {
      return "Submit";
    }
  }

  get username(): AbstractControl {
    return this.formGroup.get('username');
  }

  get usernameError(): string {
    if (this.username.hasError('required')) {
      return "username is required";
    }
  }

  get email(): AbstractControl {
    return this.formGroup.get('email');
  }

  get emailError(): string {
    if (this.email.hasError('required')) {
      return "email address is required";
    }
    if (this.email.hasError('email')) {
      return "please use a valid email format!";
    }
  }
  // #endregion

  submitForm() {
    if (this.formGroup.valid) {
      this._store.dispatch(UpdateUserSensitivesInfo({
        dto: <UserSensitivesInfoDto>this.formGroup.value
      }));
      this.setLoading();
    }
  }

  closeDialog() {
    this._dialogRef.close(null);
  }

  private setLoading(): void {
    this._subscription.add(
      this._store.select($_userLoading).subscribe(isLoading => {
        if (isLoading) {
          this.isLoadingSub.next(true);
          this.formGroup.disable();
        }
      })
    )
    this._subscription.add(
      this._store.select($_userLoaded).subscribe(isLoaded => {
        if (isLoaded) {
          setTimeout(() => {
            this.isLoadingSub.next(false);
            this.formGroup.enable();
            this._dialogRef.close({ success: true });
          }, 500);
        }
      })
    )
    this._subscription.add(
      this._store.select($_userError).subscribe(error => {
        if (error) {
          console.log(error);
          this.isLoadingSub.next(false);
          this.formGroup.enable();
        }
      })
    )
  }

}
