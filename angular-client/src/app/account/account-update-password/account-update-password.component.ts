import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserUpdatePasswordDto } from 'src/app/user';
import { UpdateUserPassword } from 'src/app/user/store/user.actions';
import { $_userError, $_userLoaded, $_userLoading } from 'src/app/user/store/user.selectors';
import { UserState } from 'src/app/user/store/user.state';
import { ConfirmPasswordValidator } from 'src/app/_shared';

@Component({
  selector: 'app-account-update-password',
  templateUrl: './account-update-password.component.html',
  styleUrls: ['./account-update-password.component.scss']
})
export class AccountUpdatePasswordComponent {
  public formGroup: FormGroup;
  public showPassword = false;
  public showNewPassword = false;
  public isLoadingSub = new BehaviorSubject(false);
  private _subscription = new Subscription();

  constructor(
    public _dialogRef: MatDialogRef<AccountUpdatePasswordComponent>,
    private _store: Store<UserState>,
  ) {
    this.formGroup = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, {
      validators: ConfirmPasswordValidator.Match({
        fieldName: 'newPassword',
        confirmName: 'confirmNewPassword'
      }),
    });
  }

  // #region getters
  get submitButtonText(): string {
    if (this.isLoadingSub.value) {
      return "Submittting...";
    } else {
      return "Submit";
    }
  }
  get oldPassword(): AbstractControl {
    return this.formGroup.get('oldPassword');
  }

  get oldPasswordError(): string {
    if (this.oldPassword.hasError('required')) {
      return "oldPassword is required";
    }
  }

  get newPassword(): AbstractControl {
    return this.formGroup.get('newPassword');
  }

  get newPasswordError(): string {
    if (this.newPassword.hasError('required')) {
      return "New password is required";
    }
    if (this.newPassword.hasError('minlength')) {
      return "Minimum 8 chars required";
    }
  }

  get confirmNewPassword(): AbstractControl {
    return this.formGroup.get('confirmNewPassword');
  }

  get confirmNewPasswordError(): string {
    if (this.confirmNewPassword.hasError('required')) {
      return "New password is required";
    }
    if (this.confirmNewPassword.hasError('minlength')) {
      return "Minimum 8 chars required";
    }
    if (this.confirmNewPassword.hasError('shouldMatch')) {
      return "New password and confirmation should match";
    }
  }
  // #endregion

  submitForm() {
    if (this.formGroup.valid) {
      this._store.dispatch(UpdateUserPassword({
        dto: <UserUpdatePasswordDto>this.formGroup.value
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