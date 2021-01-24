import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Login as LoginAction } from '../../store/auth.actions';
import { $_isLoading } from '../../store/auth.selectors';
import { AuthState, LoginDto } from '../../interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private _store: Store<AuthState>,
  ) { }

  public form: FormGroup;
  public isLoading$: Observable<boolean>;

  public get username(): AbstractControl {
    return this.form.get('username');
  }

  get usernameErrorMessage() {
    return this.username.hasError('required') && 'Username is required!';
  }

  public get password(): AbstractControl {
    return this.form.get('password');
  }

  get passwordErrorMessage() {
    return this.password.hasError('required') && 'Password is required!';
  }

  ngOnInit(): void {
    this.setUpForm();
    this.setupLoading();
  }

  private setUpForm(): void {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  private setupLoading(): void {
    this.isLoading$ = this._store.select($_isLoading).pipe(
      filter(isLoading => !!isLoading)
    )
  }

  public submitLogin(): void {
    const loginDto: LoginDto = { ...this.form.value };
    this._store.dispatch(LoginAction({ loginDto }));
  }

}
