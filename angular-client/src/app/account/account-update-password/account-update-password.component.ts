import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-update-password',
  templateUrl: './account-update-password.component.html',
  styleUrls: ['./account-update-password.component.scss']
})
export class AccountUpdatePasswordComponent {
  public formGroup: FormGroup;
  public showPassword = false;
  public showNewPassword = false;
  public showConfirmNewPassword = false;

  constructor(
    public _dialogRef: MatDialogRef<AccountUpdatePasswordComponent>,
  ) {
    this.formGroup = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  // #region getters
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
  }
  // #endregion

  submitForm() {
    if (this.formGroup.valid) {
      this._dialogRef.close(this.formGroup.value);
    }
  }

  closeDialog() {
    this._dialogRef.close(null);
  }
}