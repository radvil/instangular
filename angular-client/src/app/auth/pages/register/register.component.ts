import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NotificationService } from 'src/app/_shared/services';
import { AuthState, UserRegistrationDto } from '../../interfaces';
import { RegisterUser } from '../../store/auth.actions';
import { $_isLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  private _subscription = new Subscription();

  get name(): AbstractControl {
    return this.form.get('name');
  }

  get username(): AbstractControl {
    return this.form.get('username');
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get nameErrorMessage() {
    if (this.name.hasError('required')) return 'Name is required!';
    else return 'An error accurred';
  }

  get usernameErrorMessage() {
    if (this.username.hasError('required')) return 'Username is required!';
    if (this.username.hasError('minLength')) return 'Minimum 3 chars required!';
    else return 'An error accurred';
  }

  get emailErrorMessage() {
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Invalid email format';
    else return 'An error accurred';
  }

  get passwordErrorMessage() {
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minLength')) return 'Minimum 8 characters required';
    else return 'An error accurred';
  }

  private setUpForm(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.email,
      ]),
      password: new FormControl('', [Validators.required]),
    })
  }

  public submitForm(): void {
    const dto = <UserRegistrationDto>this.form.value;
    this._store.dispatch(RegisterUser({ dto }));
  }

  private setLoadingState(): void {
    const isLoading$ = this._store.select($_isLoading).pipe(
      tap(loading => {
        if (loading) {
          this.form.disable();
        }
      })
    );
    const isLoaded$ = this._store.select($_isLoading).pipe(
      tap(loaded => {
        if (loaded) {
          this._notificationService.success('Registration Success');
          this._router.navigateByUrl('/auth/login');
        }
      })
    );
    this._subscription.add(isLoading$.subscribe());
    this._subscription.add(isLoaded$.subscribe());
  }

  constructor(
    private _notificationService: NotificationService,
    private _router: Router,
    private _store: Store<AuthState>
  ) { }

  ngOnInit(): void {
    this.setUpForm();
    this.setLoadingState();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
