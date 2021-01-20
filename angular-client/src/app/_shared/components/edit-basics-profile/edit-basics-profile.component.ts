import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { $_authUser } from 'src/app/auth/store/auth.selectors';
import { User, UserBasicsInfoDto } from 'src/app/user';
import { UpdateUserBasicsInfo } from 'src/app/user/store/user.actions';
import { $_userLoaded, $_userLoading } from 'src/app/user/store/user.selectors';
import { UserState } from 'src/app/user/store/user.state';

@Component({
  selector: 'app-edit-basics-profile',
  templateUrl: './edit-basics-profile.component.html',
  styleUrls: ['./edit-basics-profile.component.scss']
})
export class EditBasicsProfileComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public isLoading: boolean;
  public isLoaded: boolean;
  public submitButtonText = "Save";
  private _subscription = new Subscription();

  constructor(
    private _formBuilder: FormBuilder,
    private _store: Store<UserState>,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initUser();
    this.initLoadingState();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private initForm(): void {
    this.form = this._formBuilder.group({
      name: ['', [Validators.maxLength(100)]],
      bio: ['', [Validators.minLength(5)]],
      websiteLink: [''],
      facebookLink: [''],
      twitterLink: [''],
      githubLink: [''],
    });
  }

  private initUser(): void {
    const authUser$ = this._store.select($_authUser).pipe(
      tap(user => user && this.patchForm(user))
    )
    this._subscription.add(authUser$.subscribe());
  }

  private initLoadingState(): void {
    const isLoading$ = this._store.select($_userLoading).pipe(
      tap(isLoading => {
        this.isLoading = isLoading;
        if (this.form.enabled && isLoading) {
          this.submitButtonText = "Saving...";
          this.form.disable();
        }
      })
    );
    const isLoaded$ = this._store.select($_userLoaded).pipe(
      tap(isLoaded => {
        this.isLoaded = isLoaded;
        this.isLoading = false;
        if (this.form.disabled && isLoaded) {
          this.submitButtonText = "Save";
          this.form.enable();
        }
      })
    );
    this._subscription.add(isLoading$.subscribe());
    this._subscription.add(isLoaded$.subscribe());
  }

  private patchForm(user: User): void {
    const { name, bio, websiteLink, facebookLink, twitterLink, githubLink } = user;

    if (name) this.form.patchValue({ name });
    if (bio) this.form.patchValue({ bio });
    if (websiteLink) this.form.patchValue({ websiteLink });
    if (facebookLink) this.form.patchValue({ facebookLink });
    if (twitterLink) this.form.patchValue({ twitterLink });
    if (githubLink) this.form.patchValue({ githubLink });
  }

  public submit(): void {
    if (this.form.valid) {
      this._store.dispatch(UpdateUserBasicsInfo({ dto: <UserBasicsInfoDto>this.form.value }));
    }
  }

  public next(): void {
    this._router.navigateByUrl('/home');
  }

}
