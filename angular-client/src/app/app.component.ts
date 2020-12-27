import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GetAuthUser } from './auth/store/auth.actions';
import { AuthState } from './auth/store/auth.model';
import { $_authUser, $_isAuth } from './auth/store/auth.selectors';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public authUser$: Observable<User>;
  public isAuth$: Observable<boolean>;
  public isShrinkMode = true;
  public menuItemsPrivate = [
    {
      routerLink: "/home",
      label: "Home",
      icon: "home",
    },
    {
      routerLink: "/search",
      label: "Search",
      icon: "search",
    },
    {
      routerLink: "/post/add",
      label: "Add Post",
      icon: "add",
    },
    {
      routerLink: "/message",
      label: "Message",
      icon: "message",
    },
    {
      routerLink: "/notification",
      label: "Notification",
      icon: "alarm",
    },
  ]
  public menuItemsPublic = [
    {
      routerLink: "/auth/login",
      label: "Login",
      icon: "fingerprint",
    },
    {
      routerLink: "/auth/register",
      label: "Register",
      icon: "whatshot",
    },
  ]

  public switchLayoutMode() {
    this.isShrinkMode = !this.isShrinkMode;
  }

  ngOnInit(): void {
    this.setAuthUser();
  }

  private setAuthUser(): void {
    this.authUser$ = this._store.select($_authUser);
    this.isAuth$ = this._store.select($_isAuth);
    this._store.dispatch(GetAuthUser());
  }

  constructor(
    private _store: Store<AuthState>,
  ) { }
}
