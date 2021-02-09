import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/user';

@Component({
  selector: 'app-account-update-info',
  templateUrl: './account-update-info.component.html',
  styleUrls: ['./account-update-info.component.scss']
})
export class AccountUpdateInfoComponent {
  public formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public _dialogRef: MatDialogRef<AccountUpdateInfoComponent>,
  ) {
    if (this.data.user) {
      this.formGroup = new FormGroup({
        username: new FormControl(this.data.user.username, [Validators.required]),
        email: new FormControl(this.data.user.email, [Validators.required, Validators.email]),
      });
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
      return "Please use a valid email format!";
    }
  }

  submitForm() {
    if (this.formGroup.valid) {
      this._dialogRef.close(this.formGroup.value);
    }
  }

  closeDialog() {
    this._dialogRef.close(null);
  }

}
