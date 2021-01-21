import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { $_userLoading } from 'src/app/user/store/user.selectors';
import { UserState } from 'src/app/user/store/user.state';

@Component({
  selector: 'app-init-profile-image',
  templateUrl: './init-profile-image.component.html',
  styleUrls: ['./init-profile-image.component.scss']
})
export class InitProfileImageComponent implements OnInit, OnDestroy {
  public nextActionTextSubject = new BehaviorSubject<string>("Skip");
  private _subscription = new Subscription();

  get nextActionText$(): Observable<string> {
    return this.nextActionTextSubject.asObservable();
  }

  private setNextActionText(): void {
    const isLoading$ = this._store.select($_userLoading).pipe(
      tap((isLoading) => isLoading && this.nextActionTextSubject.next("Uploading"))
    );
    const isLoaded$ = this._store.select($_userLoading).pipe(
      tap((isLoaded) => isLoaded && this.nextActionTextSubject.next("Next"))
    );
    this._subscription.add(isLoading$.subscribe());
    this._subscription.add(isLoaded$.subscribe());
  }

  public nextStep(): void {
    this._router.navigate(['auth', 'post-registered', 'setup-basics-info'])
  }

  constructor(
    private _router: Router,
    private _store: Store<UserState>,
  ) { }

  ngOnInit(): void {
    this.setNextActionText();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
